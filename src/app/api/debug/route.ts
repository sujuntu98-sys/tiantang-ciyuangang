import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testName = searchParams.get("name") || "";

    // 列出所有用户
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true },
      take: 10,
    });

    // 精确查找
    let found = null;
    if (testName) {
      found = await prisma.user.findUnique({
        where: { username: testName },
        select: { id: true, username: true },
      });
    }

    return NextResponse.json({
      totalUsers: users.length,
      users: users.map((u) => u.username),
      searchName: testName,
      encodedName: encodeURIComponent(testName),
      found: found ? true : false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Debug error" });
  }
}
