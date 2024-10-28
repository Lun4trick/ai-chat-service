import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MemoDto } from './DTOs/Memo.dto';

export type toolNameType = 'getFreeDates' | 'setMemo';

@Injectable()
export class AiFunctionsService {
  firestoreDB: FirebaseFirestore.Firestore;
  constructor(private readonly databaseService: DatabaseService) {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    this.firestoreDB = await this.databaseService.getFirestoreDB();
  }

  getFreeDates(args: { requested_year: string; requested_month: string }) {
    const formatedDate = new Date(
      `${args.requested_year}-${args.requested_month}`,
    );

    console.log(formatedDate);
    const availableDates = [
      '2024-11-01',
      '2024-11-02',
      '2024-11-03',
      '2024-11-09',
      '2024-11-15',
      '2024-12-16',
    ];

    const result = availableDates.filter(
      (date) => new Date(date) >= formatedDate,
    );

    return JSON.stringify(result);
  }

  setMemo(memo: MemoDto): string {
    try {
      this.databaseService.writeDataToFirestore('memos', memo);
      return 'Memo saved';
    } catch (error) {
      const { message } = error;
      return `Memo not saved Error: ${message}`;
    }
  }

  getAction(actionName: toolNameType) {
    switch (actionName) {
      case 'setMemo':
        return this.setMemo.bind(this);
      case 'getFreeDates':
        return this.getFreeDates.bind(this);
      default:
        return null;
    }
  }
}
