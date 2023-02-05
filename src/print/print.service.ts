import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoadedFiles } from 'src/db/entity/loaded-files.entity';
import { ClinicBilling } from 'src/db/entity/clinic-billing.entity';
import { PaymentRecords } from 'src/db/entity/payment-records.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import { FixedValues } from 'src/db/entity/fixed-values.entity';
import { PatientBilling } from 'src/db/entity/patient-billing.entity';
import moment from 'moment';
@Injectable()
export class PrintService {
  constructor(
    @InjectRepository(LoadedFiles)
    private readonly loadedFilesRepository: Repository<LoadedFiles>,
    @InjectRepository(ClinicBilling)
    private readonly clinicBillingRepository: Repository<ClinicBilling>,
    @InjectRepository(PatientBilling)
    private readonly patientBillingRepository: Repository<PatientBilling>,
    @InjectRepository(PaymentRecords)
    private readonly paymentRecordsRepository: Repository<PaymentRecords>,
    @InjectRepository(ClinicMaster)
    private readonly clinicMasterRepository: Repository<ClinicMaster>,
    @InjectRepository(FixedValues)
    private readonly fixedValuesRepository: Repository<FixedValues>,
  ) {}
  async getPrintData(clinicCode, date, type) {
    const moment = require('moment');

    if (type == '1') {
      const clinicName = await this.clinicMasterRepository.find({
        where: { clinic_code: clinicCode },
      });
      const row1 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        // .where(`to_char(fixed_values.item_2, 'yyyymm') = :billed_date`, {
        //   // clinic_code: clinicCode,
        //   billed_date: date,
        // })

        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,
          { clinic_code: clinicCode, billed_date: date, option: '補助金' },
        )
        .getOne();

      // ========================================
      const row2_1 = await this.clinicBillingRepository.find({
        where: {
          branch_id: clinicCode,
          billed_date: moment(date).format('YYYY-MM-DD'),
        },
      });
      row2_1.map(async (item) => {
        await this.clinicBillingRepository.update(item.id, {
          billed_flag: true,
        });
      });
      const clinicInsuranceAmount = row2_1.reduce(
        (a, b) => a + b.insurance_amount,
        0,
      );
      const clinincPublicamount = row2_1.reduce(
        (a, b) => a + b.public_amount,
        0,
      );

      const row2_2 = await this.patientBillingRepository.find({
        where: {
          branch_id: clinicCode,
          billed_date: moment(date).format('YYYY-MM-DD'),
          burden_ratio: 1,
        },
      });
      const patientBurdenAmount = row2_1.reduce(
        (a, b) => a + b.patient_burden_amount,
        0,
      );

      const patientSubBurdenAmount = row2_2.reduce(
        (a, b) => a + b.patient_subburden_amount,
        0,
      );

      row2_2.map(async (item) => {
        await this.patientBillingRepository.update(item.id, {
          billed_flag: true,
        });
      });

      const row2_3 = await this.patientBillingRepository.find({
        where: {
          branch_id: clinicCode,
          billed_date: moment(date).format('YYYY-MM-DD'),
        },
      });

      const patientMedicalCertAmount = row2_3.reduce(
        (a, b) => a + b.patient_medical_cert_amount,
        0,
      );

      row2_3.map(async (item) => {
        await this.patientBillingRepository.update(item.id, {
          billed_flag: true,
        });
      });

      const row2_4 = await this.patientBillingRepository.find({
        where: {
          branch_id: clinicCode,
          billed_date: moment(date).format('YYYY-MM-DD'),
        },
      });

      const patientTransportationAmount = row2_4.reduce(
        (a, b) => a + b.patient_transportation_amount,
        0,
      );

      row2_4.map(async (item) => {
        await this.patientBillingRepository.update(item.id, {
          billed_flag: true,
        });
      });

      const row2_sum =
        clinicInsuranceAmount +
        clinincPublicamount +
        patientBurdenAmount +
        patientSubBurdenAmount +
        patientMedicalCertAmount +
        patientTransportationAmount;

      const row2_2sum =
        patientBurdenAmount +
        patientSubBurdenAmount +
        patientMedicalCertAmount +
        patientTransportationAmount;
      // ========================================

      const row4 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,
          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '医師人件費等',
          },
        )
        .getOne();

      const row5 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,
          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '看護師人件費等',
          },
        )
        .getOne();
      const row6 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,
          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'ドクターアテンダント人件費等',
          },
        )
        .getOne();
      const row7 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,
          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'レンタカー代',
          },
        )
        .getOne();
      const row8 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,
          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '薬剤・検査費',
          },
        )
        .getOne();

      const row10_1 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '手数料率',
          },
        )
        .getOne();

      const percent = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '消費税率',
          },
        )
        .getOne();

      const row11_1 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '往診診療サポート-応対件数',
          },
        )
        .getOne();

      const row11_2 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '往診診療サポート-単価',
          },
        )
        .getOne();

      const row13_1 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'HRサポート-医師シフト調整時間数',
          },
        )
        .getOne();

      const row13_2 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'HRサポート-医師シフト調整時間数',
          },
        )
        .getOne();

      const row14_1 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'ドクターアテンダント-調整時間数',
          },
        )
        .getOne();

      const row14_2 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'ドクターアテンダント-単価',
          },
        )
        .getOne();

      const row18 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '費用清算金',
          },
        )
        .getOne();
      const row19 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '特別費用清算金',
          },
        )
        .getOne();
      const row21 = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: 'クリエイティブ利用料単価',
          },
        )
        .getOne();
      const lastRow = await this.fixedValuesRepository
        .createQueryBuilder('fixed_values')
        .where(
          `fixed_values.branch_id = :clinic_code AND
        to_char(fixed_values.item_2, 'yyyymm') <= :billed_date AND
        to_char(fixed_values.item_3, 'yyyymm') >= :billed_date AND
        fixed_values.item_4 = :option`,

          {
            clinic_code: clinicCode,
            billed_date: date,
            option: '適格請求書発行事業者番号',
          },
        )
        .getOne();
      return {
        clinincName: clinicName[0].clinic_name,
        row1: row1 ? parseFloat(row1.fixed_value.split(',').join('')) : null,
        row2: row2_sum ? row2_sum : null,
        row2_2sum: row2_2sum ? row2_2sum : null,
        row4: row4 ? parseFloat(row4.fixed_value.split(',').join('')) : null,
        row5: row5 ? parseFloat(row5.fixed_value.split(',').join('')) : null,
        row6: row6 ? parseFloat(row6.fixed_value.split(',').join('')) : null,
        row7: row7 ? parseFloat(row7.fixed_value.split(',').join('')) : null,
        row8: row8 ? parseFloat(row8.fixed_value.split(',').join('')) : null,
        row10: {
          data1: row10_1
            ? parseFloat(row10_1.fixed_value.split(',').join(''))
            : null,
        },
        percent: percent
          ? parseFloat(percent.fixed_value.split(',').join(''))
          : null,
        row11: {
          data1: row11_1
            ? parseFloat(row11_1.fixed_value.split(',').join(''))
            : null,
          data2: row11_2
            ? parseFloat(row11_2.fixed_value.split(',').join(''))
            : null,
        },

        row13: {
          data1: row13_1
            ? parseFloat(row13_1.fixed_value.split(',').join(''))
            : null,
          data2: row13_2
            ? parseFloat(row13_2.fixed_value.split(',').join(''))
            : null,
        },
        row14: {
          data1: row14_1
            ? parseFloat(row14_1.fixed_value.split(',').join(''))
            : null,
          data2: row14_2
            ? parseFloat(row14_2.fixed_value.split(',').join(''))
            : null,
        },
        row18: row18 ? parseFloat(row18.fixed_value.split(',').join('')) : null,
        row19: row19 ? parseFloat(row19.fixed_value.split(',').join('')) : null,
        row21: row21
          ? parseFloat(row21.fixed_value.split(',').join('')) *
            (1 + parseFloat(percent.fixed_value.split(',').join('')) / 100)
          : null,
        lastRow: lastRow
          ? parseFloat(lastRow.fixed_value.split(',').join(''))
          : null,
      };
    }
  }
}
