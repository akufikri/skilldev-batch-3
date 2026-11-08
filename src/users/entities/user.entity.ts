import { Exclude, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class UserEntity {
  @Transform(({ value }: { value: Types.ObjectId | string }) =>
    value.toString(),
  )
  _id: Types.ObjectId | string;
  name!: string;
  email!: string;
  role!: string;

  // mengecualikan passwordHash pada response/pada entity ini
  @Exclude()
  passwordHash!: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    // Jika partial._id ada, maka ubah menjadi string
    if (partial._id) {
      this._id = (partial._id as unknown as Types.ObjectId).toString();
    }
  }
}
