import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    
    console.log('🗑️ 대화 기록 삭제 요청:', { conversationId });

    // 대화 기록 삭제
    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    console.log('✅ 대화 기록 삭제 완료:', deletedConversation.id);

    return NextResponse.json({ 
      success: true, 
      message: '대화 기록이 성공적으로 삭제되었습니다.',
      deletedId: deletedConversation.id 
    });

  } catch (error) {
    console.error('❌ 대화 기록 삭제 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '대화 기록 삭제에 실패했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
