import { NextRequest, NextResponse } from "next/server";
import { client } from "../route";
import fs from "fs";

export const PUT = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const account = formData.get("account") as string | null;
    const file = formData.get("file") as File | null;

    if (!account || !file) {
      return NextResponse.json(
        {
          message: "Not exist data.",
        },
        {
          status: 400,
        }
      );
    }

    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!existUser) {
      return NextResponse.json(
        {
          message: "Not exist user.",
        },
        {
          status: 400,
        }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    fs.writeFileSync(`./public/images/${file.name}`, buffer);

    const updatedUser = await client.user.update({
      where: {
        account,
      },
      data: {
        profileImage: file.name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
};
