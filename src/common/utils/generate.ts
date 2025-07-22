export function randomPass(length = 10): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const number = '0123456789';
  const special = '!@#$%^&*()_-+=';
  const all = upper + lower + number + special;

  const getRandom = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  const required = [
    getRandom(upper),
    getRandom(lower),
    getRandom(number),
    getRandom(special),
  ];

  for (let i = required.length; i < length; i++) {
    required.push(getRandom(all));
  }

  // 순서 섞기
  return required.sort(() => Math.random() - 0.5).join('');
}
