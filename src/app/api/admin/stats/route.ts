import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Admin stats API 호출됨');

    // 전체 사용자 수
    const totalUsers = await prisma.user.count();
    
    // 오늘 가입한 사용자 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // 이번 주 가입한 사용자 수
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: weekAgo
        }
      }
    });

    // 이번 달 가입한 사용자 수
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: monthAgo
        }
      }
    });

    // 최근 7일간 일별 가입자 수
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    // 최근 7일간 일별 질문 수
    const dailyQuestionStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await prisma.tokenUsage.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      dailyQuestionStats.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    // 최근 6개월간 월별 가입자 수
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      monthlyStats.push({
        month: date.toISOString().substring(0, 7),
        count
      });
    }

    // 최근 6개월간 월별 질문 수
    const monthlyQuestionStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      const count = await prisma.tokenUsage.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      monthlyQuestionStats.push({
        month: date.toISOString().substring(0, 7),
        count
      });
    }

    // 토큰 사용량 통계
    const totalTokenUsages = await prisma.tokenUsage.count();
    const totalTokens = await prisma.tokenUsage.aggregate({
      _sum: {
        tokens: true
      }
    });

    // 모델별 사용량 통계 (provider별로 그룹화)
    const modelStats = await prisma.tokenUsage.groupBy({
      by: ['provider'],
      _count: {
        id: true
      },
      _sum: {
        tokens: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    const response = {
      users: {
        total: totalUsers,
        today: todayUsers,
        thisWeek: weekUsers,
        thisMonth: monthUsers,
        dailyStats,
        monthlyStats
      },
      usage: {
        totalQuestions: totalTokenUsages,
        totalTokens: totalTokens._sum.tokens || 0,
        dailyQuestionStats,
        monthlyQuestionStats,
        modelStats: modelStats.map(stat => ({
          provider: stat.provider,
          questionCount: stat._count.id,
          tokenCount: stat._sum.tokens || 0
        }))
      }
    };

    console.log('✅ Admin stats 조회 완료:', {
      totalUsers,
      todayUsers,
      totalTokenUsages,
      modelCount: modelStats.length
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Admin stats API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
