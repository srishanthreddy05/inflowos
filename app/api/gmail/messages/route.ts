import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized or missing Gmail access token." },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gmail API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch Gmail messages." },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.messages) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messagePromises = data.messages.map(async (msg: { id: string }) => {
      const msgRes = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!msgRes.ok) return null;
      const msgData = await msgRes.json();

      const headers = msgData.payload?.headers || [];
      const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "No Subject";
      const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
      const rawDate = headers.find((h: any) => h.name.toLowerCase() === "date")?.value;
      
      let formattedDate = "No Date";
      if (rawDate) {
        try {
          // Attempt to parse and format the date nicely
          formattedDate = new Date(rawDate).toLocaleString();
          if (formattedDate === "Invalid Date") {
             formattedDate = rawDate; // Fallback to raw if unparseable
          }
        } catch (e) {
          formattedDate = rawDate;
        }
      }

      return {
        id: msgData.id,
        subject,
        from,
        date: formattedDate,
        snippet: msgData.snippet || "",
      };
    });

    const detailedMessages = (await Promise.all(messagePromises)).filter(Boolean);

    return NextResponse.json({ messages: detailedMessages }, { status: 200 });
  } catch (error) {
    console.error("Error in Gmail API Handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
