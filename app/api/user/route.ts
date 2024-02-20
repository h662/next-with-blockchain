import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const client = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { account } = await request.json();

    if (!account) {
      return NextResponse.json(
        {
          message: "Not exist account.",
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

    if (existUser) {
      return NextResponse.json(existUser);
    }

    const newUser = await client.user.create({
      data: {
        account,
        profileImage: "owl.png",
        nickname: account,
      },
    });

    return NextResponse.json(newUser);
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

export const PUT = async (request: NextRequest) => {
  try {
    const { account, nickname } = await request.json();

    if (!account || !nickname) {
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

    const updatedUser = await client.user.update({
      where: {
        account,
      },
      data: {
        nickname,
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
