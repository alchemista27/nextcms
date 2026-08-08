"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function getDashboardStats() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  try {
    const [posts, media, users] = await Promise.all([
      prisma.post.count(),
      prisma.media.count(),
      prisma.user.count(),
    ]);

    return {
      success: true,
      data: {
        posts,
        media,
        users,
      },
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function getRecentPosts() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  try {
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, sharedUser: { select: { full_name: true } } } } }
    });
    const mappedPosts = posts.map(p => {
      const { author, ...rest } = p;
      return {
        ...rest,
        author: {
          id: author?.id || "",
          name: author?.sharedUser?.full_name || "Unknown"
        }
      };
    });

    return { success: true, data: mappedPosts };
  } catch (error) {
    console.error("Failed to fetch recent posts:", error);
    return { success: false, error: "Failed to fetch recent posts" };
  }
}

export async function getChartData() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  try {
    // Get posts from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize chart data with last 6 months
    const chartData: { name: string; year: number; month: number; posts: number; }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      chartData.push({
        name: months[d.getMonth()],
        year: d.getFullYear(),
        month: d.getMonth(),
        posts: 0,
      });
    }

    // Populate data
    posts.forEach(post => {
      const postMonth = post.createdAt.getMonth();
      const postYear = post.createdAt.getFullYear();
      
      const dataPoint = chartData.find(d => d.month === postMonth && d.year === postYear);
      if (dataPoint) {
        dataPoint.posts += 1;
      }
    });

    return { success: true, data: chartData };
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return { success: false, error: "Failed to fetch chart data" };
  }
}

export async function getActivityLog() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  try {
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true }
    });

    const combined = [
      ...recentPosts.map(p => ({ ...p, entityType: "Post" }))
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10);

    return { success: true, data: combined };
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return { success: false, error: "Failed to fetch activity log" };
  }
}
