// util/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserRole } from '../users/entity/users.entity';

interface StoreInfo {
  bizName: string;
  bizAddress: string;
  bizCategory: string;
  price?: number;
  representativeMenus?: string;
  atmosphere?: string;
  concept?: string;
}

interface MediaInfo {
  programName: string;
  companyName: string;
  department: string;
  purpose: string;
  type: string;
  targetAudience?: string;
  broadcastFeatures?: string;
}

interface InfluencerInfo {
  representativeName: string;
  influDepartment: string;
  influPurpose: string;
  influType: string;
  subscriberCount?: string;
  contentType?: string;
}

interface PromptOptions {
  tone?: string;
  keywords?: string;
}

// Gemini API 클라이언트 세팅
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 톤앤매너 매핑
const toneMapping = {
  friendly: '친근하고 따뜻한',
  professional: '전문적이고 신뢰감 있는',
  humorous: '재미있고 유머러스한'
};

// 가게 정보 프롬프트 생성
export function generateStorePrompt(
  storeInfo: StoreInfo,
  options: PromptOptions = {}
): string {
  const tone = options.tone ? toneMapping[options.tone] || '친근한' : '친근한';
  const keywords = options.keywords ? `키워드: ${options.keywords}` : '';
  
  const menuText = storeInfo.representativeMenus ? `대표 메뉴는 ${storeInfo.representativeMenus}이고,` : '';
  const atmosphereText = storeInfo.atmosphere ? `분위기는 ${storeInfo.atmosphere}하며,` : '';
  const conceptText = storeInfo.concept ? `${storeInfo.concept}에 적합한 곳입니다.` : '';
  const priceText = storeInfo.price ? `가격대는 ${storeInfo.price}원 정도입니다.` : '';

  return `
    다음 정보를 바탕으로 ${tone} 톤으로 매력적인 가게 소개글을 작성해주세요.
    
    가게명: ${storeInfo.bizName}
    주소: ${storeInfo.bizAddress}
    업종: ${storeInfo.bizCategory}
    ${menuText}
    ${atmosphereText}
    ${conceptText}
    ${priceText}
    ${keywords}
    
    요구사항:
    - 200-300자 내외로 작성
    - 가게의 특징과 매력을 강조
    - 고객이 방문하고 싶게 만드는 내용
    - ${tone} 톤으로 작성
    ${keywords ? '- 제공된 키워드를 자연스럽게 포함' : ''}
  `;
}

// 미디어 정보 프롬프트 생성
export function generateMediaPrompt(
  mediaInfo: MediaInfo,
  options: PromptOptions = {}
): string {
  const tone = options.tone ? toneMapping[options.tone] || '전문적인' : '전문적인';
  const keywords = options.keywords ? `키워드: ${options.keywords}` : '';
  
  const targetText = mediaInfo.targetAudience ? `주요 시청층은 ${mediaInfo.targetAudience}이며,` : '';
  const featuresText = mediaInfo.broadcastFeatures ? `방송 특징: ${mediaInfo.broadcastFeatures}` : '';

  return `
    다음 정보를 바탕으로 ${tone} 톤으로 방송 프로그램 소개글을 작성해주세요.
    
    방송사: ${mediaInfo.companyName}
    프로그램명: ${mediaInfo.programName}
    부서: ${mediaInfo.department}
    목적: ${mediaInfo.purpose}
    방송 유형: ${mediaInfo.type}
    ${targetText}
    ${featuresText}
    ${keywords}
    
    요구사항:
    - 200-300자 내외로 작성
    - 프로그램의 전문성과 신뢰성 강조
    - 시청자들이 관심을 가질 만한 내용
    - ${tone} 톤으로 작성
    ${keywords ? '- 제공된 키워드를 자연스럽게 포함' : ''}
  `;
}

// 인플루언서 정보 프롬프트 생성
export function generateInfluencerPrompt(
  influencerInfo: InfluencerInfo,
  options: PromptOptions = {}
): string {
  const tone = options.tone ? toneMapping[options.tone] || '친근한' : '친근한';
  const keywords = options.keywords ? `키워드: ${options.keywords}` : '';
  
  const subscriberText = influencerInfo.subscriberCount ? `구독자 규모: ${influencerInfo.subscriberCount}` : '';
  const contentText = influencerInfo.contentType ? `주요 콘텐츠: ${influencerInfo.contentType}` : '';

  return `
    다음 정보를 바탕으로 ${tone} 톤으로 인플루언서 소개글을 작성해주세요.
    
    채널명: ${influencerInfo.representativeName}
    분야: ${influencerInfo.influDepartment}
    목적: ${influencerInfo.influPurpose}
    유형: ${influencerInfo.influType}
    ${subscriberText}
    ${contentText}
    ${keywords}
    
    요구사항:
    - 200-300자 내외로 작성
    - 인플루언서의 개성과 매력 강조
    - 팔로워들이 흥미를 느낄 만한 내용
    - ${tone} 톤으로 작성
    ${keywords ? '- 제공된 키워드를 자연스럽게 포함' : ''}
  `;
}

// 통합 프롬프트 생성 함수
export function generatePrompt(
  userRole: UserRole,
  userInfo: StoreInfo | MediaInfo | InfluencerInfo,
  options: PromptOptions = {}
): string {
  switch (userRole) {
    case UserRole.BIZ:
      return generateStorePrompt(userInfo as StoreInfo, options);
    case UserRole.MEDIA:
      return generateMediaPrompt(userInfo as MediaInfo, options);
    case UserRole.INFLUENCER:
      return generateInfluencerPrompt(userInfo as InfluencerInfo, options);
    default:
      throw new Error('지원하지 않는 사용자 유형입니다.');
  }
}

// Gemini 호출 함수
export async function callGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    throw new Error('AI 소개글 생성에 실패했습니다.');
  }
}
