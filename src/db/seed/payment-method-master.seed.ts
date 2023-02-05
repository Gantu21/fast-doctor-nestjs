import { createConnection } from 'typeorm';
import { PaymentMethodMaster } from '../entity/payment-method-master.entity';

async function seedData() {
  const connection = await createConnection();
  const paymentMethodMasterRepository =
    connection.getRepository(PaymentMethodMaster);

  const paymentMethods = [
    { payment_method: '0', payment_method_text: 'GMO' },
    { payment_method: '2', payment_method_text: 'NP' },
    { payment_method: '3', payment_method_text: '支払なし' },
    { payment_method: '4', payment_method_text: 'コンビニ払い' },
    { payment_method: '5', payment_method_text: '振込' },
  ];

  const entities = paymentMethods.map((paymentMethod) => {
    const entity = new PaymentMethodMaster();
    entity.payment_method = paymentMethod.payment_method;
    entity.payment_method_text = paymentMethod.payment_method_text;
    return entity;
  });

  await paymentMethodMasterRepository.save(entities);
  console.log('Data seeded!');

  await connection.destroy();
}

seedData().catch((error) => console.log(error));
