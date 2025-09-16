import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 User stats API 호출됨');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      // 모든 사용자 목록과 기본 통계 반환
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              tokenUsages: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const totalTokens = await prisma.tokenUsage.aggregate({
            where: {
              userId: user.id
            },
            _sum: {
              tokens: true
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            totalQuestions: user._count.tokenUsages,
            totalTokens: totalTokens._sum.tokens || 0
          };
        })
      );

      return NextResponse.json({
        users: usersWithStats
      });
    }

    // 특정 사용자의 상세 통계
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 전체 토큰 사용량
    const totalTokens = await prisma.tokenUsage.aggregate({
      where: {
        userId: userId
      },
      _sum: {
        tokens: true
      },
      _count: {
        id: true
      }
    });

    // 모델별 사용량 통계
    const modelStats = await prisma.tokenUsage.groupBy({
      by: ['provider'],
      where: {
        userId: userId
      },
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

    // 최근 7일간 일별 사용량
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await prisma.tokenUsage.count({
        where: {
          userId: userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });

      const tokens = await prisma.tokenUsage.aggregate({
        where: {
          userId: userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        },
        _sum: {
          tokens: true
        }
      });
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        count,
        tokens: tokens._sum.tokens || 0
      });
    }

    // 최근 6개월간 월별 사용량
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      const count = await prisma.tokenUsage.count({
        where: {
          userId: userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });

      const tokens = await prisma.tokenUsage.aggregate({
        where: {
          userId: userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        },
        _sum: {
          tokens: true
        }
      });
      
      monthlyStats.push({
        month: date.toISOString().substring(0, 7),
        count,
        tokens: tokens._sum.tokens || 0
      });
    }

    const response = {
      user,
      stats: {
        totalQuestions: totalTokens._count.id,
        totalTokens: totalTokens._sum.tokens || 0,
        modelStats: modelStats.map(stat => ({
          provider: stat.provider,
          questionCount: stat._count.id,
          tokenCount: stat._sum.tokens || 0
        })),
        dailyStats,
        monthlyStats
      }
    };

    console.log('✅ User stats 조회 완료:', {
      userId,
      totalQuestions: totalTokens._count.id,
      totalTokens: totalTokens._sum.tokens || 0
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ User stats API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
