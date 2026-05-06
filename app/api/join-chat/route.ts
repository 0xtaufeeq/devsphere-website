import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const apiKey = process.env.COHERE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "COHERE_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a super friendly, cool, and very human DevSphere admissions assistant.
Your goal is to collect the following information from the user naturally to complete their application:
1. fullName
2. email
3. phone
4. yearBranch (e.g. 2nd Year CSE)
5. roleInterest (e.g. Tech, Media, Events, PR, Operations)
6. experience (relevant projects, events, clubs, internships - min 25 chars)
7. motivation (why they want to join - min 30 chars)
8. commitment (hours per week)

PERSONALITY & TONE RULES:
* Be extremely human, casual, and cool. Talk like a friendly student leader, not a robot.
* NEVER use em dashes or hyphens for punctuation (like "—" or "-"). Use commas, periods, or new lines instead.
* Keep responses relatively short and sweet.
* When asking questions, give quick examples of what you mean! For example: "What's your preferred leadership vertical? You could say something like 'I'm really interested in Tech and PR!'"
* Do not blindly echo what they say. If they say "I'm Taufeeq", say something like "Awesome to meet you Taufeeq! Could you drop your email address?"
* Ask for only ONE or TWO missing pieces of info at a time so it feels like a real chat.
* Gently ask for more detail if their experience or motivation is too short.

JSON COMPLETION RULE:
Once you have ALL the information, and ONLY when you have it all, your final message MUST be exactly a JSON object (and nothing else) with the collected keys:
{
  "fullName": "...",
  "email": "...",
  "phone": "...",
  "yearBranch": "...",
  "roleInterest": "...",
  "experience": "...",
  "motivation": "...",
  "commitment": "..."
}
Do not output markdown code blocks. Just the raw JSON object string.
If you do not have all information, respond normally with your friendly text.`

    let validMessages = messages
    while (validMessages.length > 0 && validMessages[0].role === "assistant") {
      validMessages = validMessages.slice(1)
    }

    const cohereMessages = [
      { role: "system", content: systemPrompt },
      ...validMessages.map((m: any) => ({
        role: m.role,
        content: m.text
      }))
    ]

    const response = await fetch("https://api.cohere.com/v2/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "command-r-plus-08-2024",
        messages: cohereMessages,
        temperature: 0.1,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cohere API Error:", errorText)
      return NextResponse.json(
        { error: "Failed to get response from Cohere" },
        { status: 502 }
      )
    }

    const data = await response.json()
    let text = data.message?.content?.[0]?.text || ""

    // Clean up potential markdown formatting if the model still outputs it
    if (text.trim().startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '').trim()
    } else if (text.trim().startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '').trim()
    }

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error calling Cohere API:", error)
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    )
  }
}
