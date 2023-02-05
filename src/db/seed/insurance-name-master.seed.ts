import { createConnection } from 'typeorm';
import { InsuranceNameMaster } from '../entity/insurance-name-master.entity';
async function seedData() {
  const connection = await createConnection();
  const paymentMethodMasterRepository =
    connection.getRepository(InsuranceNameMaster);

  const paymentMethods = [
    {
      insurance_number: '01',
      insurance_name: '健康保険法',
      insurance_type: '社保',
    },
    {
      insurance_number: '03',
      insurance_name: '健康保険法',
      insurance_type: '社保',
    },
    {
      insurance_number: '06',
      insurance_name: '健康保険法',
      insurance_type: '社保',
    },
    {
      insurance_number: '63',
      insurance_name: '健康保険法',
      insurance_type: '社保',
    },
    {
      insurance_number: '67',
      insurance_name: '国民健康保険法',
      insurance_type: '国保',
    },
    {
      insurance_number: '00',
      insurance_name: '国民健康保険法',
      insurance_type: '国保',
    },
    {
      insurance_number: '39',
      insurance_name: '高齢者の医療の確保に関する法律',
      insurance_type: '後期高齢者',
    },
    {
      insurance_number: '02',
      insurance_name: '船員保険法',
      insurance_type: '社保',
    },
    {
      insurance_number: '31',
      insurance_name: '国家公務員共済組合法',
      insurance_type: '社保',
    },
    {
      insurance_number: '72',
      insurance_name: '国家公務員共済組合法',
      insurance_type: '社保',
    },
    {
      insurance_number: '37',
      insurance_name: '防衛省の職員の給与等に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '07',
      insurance_name: '防衛省の職員の給与等に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '32',
      insurance_name: '地方公務員等共済組合法',
      insurance_type: '社保',
    },
    {
      insurance_number: '33',
      insurance_name: '地方公務員等共済組合法',
      insurance_type: '社保',
    },
    {
      insurance_number: '73',
      insurance_name: '地方公務員等共済組合法',
      insurance_type: '社保',
    },
    {
      insurance_number: '34',
      insurance_name: '私立学校教職員共済法',
      insurance_type: '社保',
    },
    {
      insurance_number: '75',
      insurance_name: '私立学校教職員共済法',
      insurance_type: '社保',
    },
    {
      insurance_number: '13',
      insurance_name: '戦傷病者特別援護法',
      insurance_type: '社保',
    },
    {
      insurance_number: '23',
      insurance_name: '母子保健法',
      insurance_type: '社保',
    },
    {
      insurance_number: '17',
      insurance_name: '児童福祉法',
      insurance_type: '社保',
    },
    {
      insurance_number: '79',
      insurance_name: '児童福祉法',
      insurance_type: '社保',
    },
    {
      insurance_number: '19',
      insurance_name: '原子爆弾被爆者に対する援護に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '12',
      insurance_name: '生活保護法',
      insurance_type: '社保',
    },
    {
      insurance_number: '25',
      insurance_name:
        '中国残留邦人等の円滑な帰国の促進並びに永住帰国した中国残留邦人等及び特定配偶者の自立の支援に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '21',
      insurance_name: '精神保健及び精神障害者福祉に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '22',
      insurance_name: '麻薬及び向精神薬取締法',
      insurance_type: '社保',
    },
    {
      insurance_number: '28',
      insurance_name: '感染症の予防及び感染症の患者に対する医療に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '30',
      insurance_name:
        '心神喪失等の状態で重大な他害行為を行った者の医療及び観察等に関する法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '-',
      insurance_name: '介護保険法',
      insurance_type: '社保',
    },
    {
      insurance_number: '15',
      insurance_name:
        '障害者の日常生活及び社会生活を総合的に支援するための法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '16',
      insurance_name:
        '障害者の日常生活及び社会生活を総合的に支援するための法律',
      insurance_type: '社保',
    },
    {
      insurance_number: '54',
      insurance_name: '難病の患者に対する医療等に関する法律',
      insurance_type: '社保',
    },
  ];

  const entities = paymentMethods.map((paymentMethod) => {
    const entity = new InsuranceNameMaster();
    entity.insurance_number = paymentMethod.insurance_number;
    entity.insurance_name = paymentMethod.insurance_name;

    return entity;
  });

  await paymentMethodMasterRepository.save(entities);
  console.log('Data seeded!');

  await connection.destroy();
}

seedData().catch((error) => console.log(error));
