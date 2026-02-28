import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    // endpoint for asking a question to the PDF file

    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const { id: userId } = user ?? {};

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { fileId, message } = SendMessageValidator.parse(body);

    // get file from the database
    const file = await db.askPDF_File.findFirst({
        where: {
            id: fileId,
            askPDF_UserId: userId,
        },
    });

    if (!file) return new Response("Not found", { status: 404 });

    // create a new message
    await db.askPDF_Message.create({
        data: {
            text: message,
            isUserMessage: true,
            askPDF_UserId: userId,
            askPDF_FileId: fileId,
        },
    });
};
