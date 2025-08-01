// util/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

interface storeType {}

// Gemini API 클라이언트 세팅
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 프롬프트 생성 함수 타
export function generatePrompt() {
  //가게 정보들을 객체로 받아서 내용을 토대로 map돌려서 프롬포트화 시킬 예정 ex { 가게상호명 : 지코바, 가게주소 : 서울특별시 마포구 ,}
  //ex : 가게 이름은 ${store.name}이고 주소는 ${store.address}이고 다른 정보들이 있어 이걸 이용해서 이 지역과 이 맛집을 소개하는 글좀 작성해줘
}

// Gemini 호출 함수
export async function callGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
