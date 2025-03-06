import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import mime from "mime";

// 初始化 Google Cloud Storage 客户端
const storage = new Storage({
  projectId: "qiyin-434704", // 替换为你的项目ID
  keyFilename: "static/qiyin-434704-a73c52495c76.json", // 替换为你的服务账号密钥路径
});

const bucketName = "eclicktech_test_0305";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }
    if (file.size < 1) {
      return NextResponse.json({ error: "File is empty." }, { status: 400 });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension =
      mime.getExtension(file.type) || file.name.split(".").pop() || "bin"; // 处理文件扩展名
    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${extension}`;

    // await storage.bucket(bucketName).file(filename).save(buffer);
    const url = await getSignedUrl(filename);
    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": "application/octet-stream" },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while trying to upload a file", error);
    return NextResponse.json({ error: `Upload failed` }, { status: 500 });
  }
}

export const getSignedUrl = async (fileName: string): Promise<string> => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const [url] = await file.getSignedUrl({
    action: "write",
    version: "v4",
    expires: Date.now() + 15 * 60 * 1000,
    contentType: "application/octet-stream",
  });

  return url;
};
