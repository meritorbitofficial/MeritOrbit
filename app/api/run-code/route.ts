import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: body.source_code,
        language_id: body.language_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key":
            process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host":
            "judge0-ce.p.rapidapi.com",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      error: "Failed",
    });
  }
}