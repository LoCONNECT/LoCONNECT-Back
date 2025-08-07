import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settlement } from './settlement.entity';
import { Payment } from '../payment/payment.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // 정산 내역
  async getSettlementHistory(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const payments = await this.paymentRepository.find({
      where: {
        user: { id: userId },
        settlement: {
          settlementDate: Between(startDate, endDate),
        },
      },
      relations: ['settlement', 'proposal'],
      order: { paidAt: 'DESC' },
    });

    const grouped: Record<
      string,
      {
        date: string;
        totalAmount: number;
        settles: {
          id: number;
          name: string;
          price: number;
          desc: string;
          thumbnail: string | null;
          settleStatus: string;
        }[];
      }
    > = {};

    for (const payment of payments) {
      const date = payment.settlement.settlementDate;
      const dateStr = `${String(date.getFullYear()).slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          date: dateStr,
          totalAmount: 0,
          settles: [],
        };
      }

      grouped[dateStr].totalAmount += payment.price;

      grouped[dateStr].settles.push({
        id: payment.id,
        name: payment.proposal?.title ?? '제목 없음',
        price: payment.price,
        desc: payment.proposal?.content ?? '',
        thumbnail: payment.proposal?.thumbnail ?? null,
        settleStatus: payment.proposal.status,
      });
    }

    return Object.values(grouped);
  }
}
