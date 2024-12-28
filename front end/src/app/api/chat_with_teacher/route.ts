 import { NextResponse } from "next/server";
 import OpenAI from "openai";

 // Initialize OpenAI client
 const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
 });

 // Define topics and their descriptions
 const topics = {
   "Computer Science": {
     context: `You are an expert computer science teacher who makes learning fun and engaging. 
    You often use analogies, examples, and sometimes even haikus or creative explanations to make concepts clear.
    Your responses should be informative yet accessible, mixing technical accuracy with engaging delivery.
    You can cover topics from basic programming to advanced computer science concepts.`,
     initialPrompt: `As a computer science teacher, help the student understand the concepts clearly and engagingly.
    Use examples when helpful, and make sure to break down complex topics into digestible parts.`,
   },
   Mathematics: {
     context: `You are an enthusiastic mathematics teacher who loves making math accessible and interesting.
    You use real-world examples, visual explanations, and sometimes playful approaches to explain mathematical concepts.
    Your goal is to help students not just learn the procedures, but understand the underlying concepts.`,
     initialPrompt: `As a mathematics teacher, guide the student through mathematical concepts with clarity and enthusiasm.
    Use practical examples and step-by-step explanations when needed.`,
   },
 };

 export async function POST(request: Request) {
   try {
     const body = await request.json();
     const { teacher_name, topic, user_msg } = body;

     if (!teacher_name || !topic || !user_msg) {
       return NextResponse.json(
         { error: "Missing required fields" },
         { status: 400 }
       );
     }

     // Get topic context or use default
     const topicInfo =
       topics[topic as keyof typeof topics] || topics["Computer Science"];

     // Construct the message array for the chat
     const messages = [
       {
         role: "system",
         content: `${topicInfo.context}\nYour name is ${teacher_name}. Maintain a supportive and encouraging tone.`,
       },
       {
         role: "user",
         content: `${topicInfo.initialPrompt}\n\nStudent's message: ${user_msg}`,
       },
     ];

     // Call OpenAI API
     const completion = await openai.chat.completions.create({
       model: "gpt-3.5-turbo",
       messages: messages,
       temperature: 0.7,
       max_tokens: 500,
       presence_penalty: 0.2,
       frequency_penalty: 0.3,
     });

     // Extract the response
     const teacher_response =
       completion.choices[0]?.message?.content ||
       "I apologize, but I'm having trouble formulating a response.";

     // Return the formatted response
     return NextResponse.json({
       teacher_response: {
         teacher_response,
       },
     });
   } catch (error) {
     console.error("Error in chat_with_teacher:", error);
     return NextResponse.json(
       { error: "Internal server error" },
       { status: 500 }
     );
   }
 }