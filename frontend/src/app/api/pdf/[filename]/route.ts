import { NextResponse } from "next/server";
import http from "http";

export async function GET(
    req: Request,
    { params }: { params: { filename: string } }

) {


    const fileUrl = `${process.env.SERVER_HOST}/uploads/pdf/${params.filename}`;

    return new Promise((resolve) => {
        http.get(fileUrl, (nodeRes) => {
            if (nodeRes.statusCode !== 200) {
                resolve(
                    new NextResponse("PDF introuvable", { status: 404 })
                );
                return;
            }

            const stream = new ReadableStream({
                start(controller) {
                    nodeRes.on("data", chunk => controller.enqueue(chunk));
                    nodeRes.on("end", () => controller.close());
                    nodeRes.on("error", () => controller.error());
                },
            });

            resolve(
                new NextResponse(stream, {
                    headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline",
                        "Cache-Control": "no-store",
                    },
                })
            );
        });
    });
}
