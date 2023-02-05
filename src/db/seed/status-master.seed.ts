import { createConnection } from 'typeorm';
import { StatusMaster } from '../entity/status-master.entity';

async function seedData() {
  const connection = await createConnection();
  const statusMasterRepository = connection.getRepository(StatusMaster);

  const statuses = [
    { status: '0', status_text: '患者入力待ち' },
    { status: '1', status_text: '事務作業待ち' },
    { status: '2', status_text: 'レセ計算 or 自動請求待ち' },
    { status: '70', status_text: '取消済' },
    { status: '80', status_text: '請求済/支払済' },
    { status: '81', status_text: '支払なし' },
    { status: '90', status_text: '審査落ち' },
    { status: '91', status_text: '審査落ち（要作業）' },
  ];

  const entities = statuses.map((status) => {
    const entity = new StatusMaster();
    entity.status = status.status;
    entity.status_text = status.status_text;
    return entity;
  });

  await statusMasterRepository.save(entities);
  console.log('Data seeded!');

  await connection.destroy();
}

seedData().catch((error) => console.log(error));
