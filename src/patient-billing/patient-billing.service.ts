import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PatientBilling } from '../db/entity/patient-billing.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import { Patientpayments } from '../db/entity/patient-payments.entity';
import { PaymentRecords } from '../db/entity/payment-records.entity';
import { LoadedFiles } from '../db/entity/loaded-files.entity';

@Injectable()
export class PatientBillingService {
  constructor(
    @InjectRepository(PatientBilling)
    private readonly PatientBillingRepository: Repository<PatientBilling>,

    @InjectRepository(ClinicMaster)
    private readonly clinicMasterRepository: Repository<ClinicMaster>,

    @InjectRepository(Patientpayments)
    private readonly patientpaymentsRepository: Repository<Patientpayments>,

    @InjectRepository(PaymentRecords)
    private readonly paymentRecordsRepository: Repository<PaymentRecords>,

    @InjectRepository(LoadedFiles)
    private readonly loadedFilesRepository: Repository<LoadedFiles>,
  ) {}

  async filterPatientBilling(filterValues) {
    let query = this.PatientBillingRepository.createQueryBuilder(
      'patient_billing',
    ).leftJoinAndMapMany(
      'patient_billing.clinic_master',
      ClinicMaster,
      'clinic_master',
      'patient_billing.branch_id = clinic_master.clinic_code',
    );
    const {
      branch_id,
      business_date_start,
      business_date_end,
      patient_id,
      patient_reception_id,
      kana_name,
      birthday,
      payment_method,
      billed_date,
      account_id,
    } = filterValues;

    if (
      !business_date_start &&
      !business_date_end &&
      !patient_id &&
      !patient_reception_id &&
      !kana_name &&
      !birthday &&
      !payment_method &&
      !billed_date &&
      !account_id &&
      branch_id
    ) {
      query = query.andWhere({ branch_id });
    }

    if (business_date_start && business_date_end) {
      query = query.andWhere({
        business_date: Between(business_date_start, business_date_end),
      });
    }

    if (patient_id) {
      query = query.andWhere({ patient_id: patient_id });
    }

    if (patient_reception_id) {
      query = query.andWhere({ patient_reception_id: patient_reception_id });
    }

    if (kana_name) {
      query = query.andWhere({ kana_name: kana_name });
    }

    if (birthday) {
      query = query.andWhere({ birthday: birthday });
    }

    if (payment_method) {
      query.andWhere({ payment_method: payment_method });
    }

    if (billed_date) {
      query.andWhere({ billed_date: new Date(billed_date) });
    }

    if (account_id) {
      query.andWhere({ account_id: account_id });
    }

    const matchingRows = (await query.getMany()).map((row) => {
      const moment = require('moment');

      const business_date = new Date(row.business_date);
      const createdAt = moment(business_date).format('YYYY/MM/DD');

      const birthday = new Date(row.birthday);
      const createdBirthday = moment(birthday).format('YYYY/MM/DD');

      const billing_updated_at = new Date(row.billing_updated_at);
      const createdBIll = moment(billing_updated_at).format('YYYY/MM/DD');

      const billed_date = new Date(row.billed_date);
      const billedDate = moment(billed_date).format('YYYY/MM');

      const created_date = new Date(row.created_at);
      const createdDate = moment(created_date).format('YYYY/MM/DD HH:mm A');

      (row.business_date = createdAt),
        (row.birthday = createdBirthday),
        (row.billing_updated_at = createdBIll),
        (row.billed_date = billedDate),
        (row.created_at = createdDate),
        (row.clinic_master = row.clinic_master[0].clinic_name);

      return row;
    });

    return matchingRows;
  }

  // insert from table-----------------------------------------------------------------------------------------------//

  async insertNewpatientbilling(data) {
    let moment = require('moment');
    await data.forEach(async (arr, i) => {
      const result = await this.PatientBillingRepository.find({
        where: { id: data[i][1] },
      });
      if (result.length > 0) {
        try {
          const patientBilling = new PatientBilling();
          patientBilling.branch_id = result[0].branch_id;
          patientBilling.business_date = result[0].business_date;
          patientBilling.patient_id = data[i][4];
          patientBilling.patient_reception_id = data[i][3];
          patientBilling.kana_name = data[i][5];
          patientBilling.birthday =
            new Date().getFullYear() +
            '-' +
            moment(data[i][6], 'MMM-D').format('MM-DD');
          patientBilling.patient_subburden_amount = data[i][7];
          patientBilling.patient_medical_cert_amount = data[i][8];
          patientBilling.patient_transportation_amount = data[i][9];
          patientBilling.patient_deposit_amount = data[i][10];
          patientBilling.payment_fee = data[i][11];
          patientBilling.amount = data[i][12];
          patientBilling.status = data[i][14];
          patientBilling.payment_method = data[i][15];
          patientBilling.receipt_comment = data[i][19];
          patientBilling.billing_updated_at =
            new Date().getFullYear() +
            '-' +
            moment(data[i][16], 'MMM-D').format('MM-DD');

          patientBilling.correction_reason = data[i][18];
          patientBilling.billed_date =
            new Date().getFullYear() +
            '-' +
            moment(data[i][17], 'MMM-D').format('MM-DD');

          patientBilling.burden_ratio = result[0].burden_ratio;
          patientBilling.billed_flag = result[0].billed_flag;
          patientBilling.account_id = '8888';
          patientBilling.created_at = new Date();
          patientBilling.updated_at = null;
          patientBilling.insurance_number = result[0].insurance_number;
          patientBilling.insurance_name = result[0].insurance_name;
          patientBilling.infant_medical_recipient_number =
            result[0].infant_medical_recipient_number;

          const patientBIll = await this.PatientBillingRepository.save(
            patientBilling,
          );

          if (patientBIll) {
            let query = await this.PatientBillingRepository.createQueryBuilder(
              'patient_billing',
            )
              .leftJoinAndMapMany(
                'patient_billing.payment_records',
                PaymentRecords,
                'payment_records',
                'patient_billing.patient_reception_id = payment_records.patient_reception_id',
              )
              .orderBy('patient_billing.id', 'DESC');
            const joinedData = await Promise.resolve(query.getOne());

            // console.log("A1", joinedData)
            // console.log("A2", joinedData.payment_records)

            const result = (joinedData.payment_records as unknown as any[]).map(
              async (element) => {
                const patientpayments = new Patientpayments();
                patientpayments.branch_id = joinedData.branch_id;
                patientpayments.patient_reception_id =
                  joinedData.patient_reception_id;
                patientpayments.patient_id = joinedData.patient_id;
                patientpayments.kana_name = joinedData.kana_name;
                patientpayments.birthday = joinedData.birthday;
                patientpayments.burden_ratio = joinedData.burden_ratio;
                patientpayments.patient_subburden_amount =
                  joinedData.patient_subburden_amount;
                patientpayments.patient_medical_cert_amount =
                  joinedData.patient_medical_cert_amount;
                patientpayments.patient_transportation_amount =
                  joinedData.patient_transportation_amount;
                patientpayments.patient_deposit_amount =
                  joinedData.patient_deposit_amount;
                patientpayments.payment_fee = joinedData.payment_fee;
                patientpayments.insurance_number = joinedData.insurance_number;
                patientpayments.insurance_name = joinedData.insurance_name;
                patientpayments.infant_medical_recipient_number =
                  joinedData.infant_medical_recipient_number;
                patientpayments.patient_billed_amount =
                  joinedData.patient_subburden_amount +
                  joinedData.patient_medical_cert_amount +
                  joinedData.patient_transportation_amount +
                  joinedData.patient_deposit_amount +
                  joinedData.payment_fee;
                patientpayments.patient_burden_amount =
                  element.patient_burden_amount;
                patientpayments.invoice_deposit_difference_amount =
                  patientpayments.patient_billed_amount -
                  patientpayments.patient_burden_amount;
                patientpayments.payment_status = element.payment_status;
                patientpayments.payment_method = joinedData.payment_method;
                patientpayments.status = joinedData.status;
                patientpayments.payment_date = element.payment_date;
                patientpayments.correction_reason =
                  joinedData.correction_reason;
                patientpayments.receipt_comment = joinedData.receipt_comment;
                patientpayments.receipt_matching_result = null;
                patientpayments.billed_date = joinedData.billed_date;
                patientpayments.billed_flag = joinedData.billed_flag;
                patientpayments.account_id = joinedData.account_id;
                patientpayments.created_at = new Date();
                patientpayments.updated_at = null;
                patientpayments.business_date = joinedData.business_date;

                await this.patientpaymentsRepository.save(patientpayments);
              },
            );
          }
        } catch (error) {
          throw error;
        }
      } else {
        return 'No matching result';
      }
    });
    return data;
  }
  //-----------------------------------------------------------------------------------------------//

  // insert newData from csv file-----------------------------------------------------------------//

  async insertPatientBilling(data, fileName, branchId) {
    const Encoding = require('encoding-japanese');
    const moment = require('moment');
    let encodedFileName = Encoding.convert(fileName, {
      to: 'UNICODE',
      from: 'auto',
    });
    try {
      const fileID = await this.loadedFilesRepository.find({
        where: { file_name: encodedFileName },
      });

      const dataToInsert = data.slice(1);
      for (const item of dataToInsert) {
        if (item.length !== 0 && item.length !== 1) {
          const patientBilling = new PatientBilling();
          patientBilling.branch_id = branchId;
          patientBilling.business_date = item[2];
          patientBilling.birthday = item[6] == '' ? null : item[6];
          patientBilling.insurance_number = item[7];
          patientBilling.insurance_name = item[8];
          patientBilling.infant_medical_recipient_number = item[9];
          patientBilling.patient_reception_id = item[4] == '' ? null : item[4];
          patientBilling.patient_id =
            item[3] == '' || isNaN(item[3]) ? null : item[3];
          patientBilling.kana_name = item[5];
          patientBilling.patient_subburden_amount =
            item[11] == '' || isNaN(item[11]) ? null : item[11];
          patientBilling.patient_medical_cert_amount =
            item[12] == '' || isNaN(item[12]) ? null : item[12];
          patientBilling.patient_transportation_amount =
            item[13] == '' || isNaN(item[13]) ? null : item[13];
          patientBilling.patient_deposit_amount =
            item[14] == '' || isNaN(item[14]) ? null : item[14];
          patientBilling.payment_fee =
            item[15] == '' || isNaN(item[15]) ? null : item[15];
          patientBilling.burden_ratio =
            item[10] == '' || isNaN(item[10]) ? null : item[10];
          patientBilling.amount =
            item[16] == '' || isNaN(item[16]) ? null : item[16];
          patientBilling.payment_method = {
            GMO: 1,
            NP: 2,
            支払なし: 3,
            コンビニ払い: 4,
            振込: 5,
          }[item[17]];

          patientBilling.status = {
            患者入力待ち: 0,
            事務作業待ち: 1,
            レセ計算: 2,
            自動請求待ち: 2,
            取消済: 70,
            '請求済/支払済': 80,
            支払なし: 81,
            審査落ち: 90,
            '審査落ち（要作業）': 91,
          }[item[18]];

          patientBilling.receipt_comment = item[19];
          patientBilling.billed_date =
            item[21] === '' ||
            moment(item[21], 'YYYY/MM').format('YYYY-MM-DD') === 'Invalid date'
              ? null
              : (item[21] = moment(item[21], 'YYYY/MM').format('YYYY-MM-DD'));
          patientBilling.billing_updated_at = item[20] == '' ? null : item[20];
          patientBilling.created_at = new Date();
          patientBilling.account_id = '8888';
          patientBilling.loaded_files_id = fileID[0].id;

          const result = await this.PatientBillingRepository.save(
            patientBilling,
          );
        }
      }

      // try{
      let query = await this.PatientBillingRepository.createQueryBuilder(
        'patient_billing',
      )
        .leftJoinAndMapMany(
          'patient_billing.payment_records',
          PaymentRecords,
          'payment_records',
          'patient_billing.patient_reception_id = payment_records.patient_reception_id',
        )
        .where('patient_billing.loaded_files_id = :loaded_files_id', {
          loaded_files_id: fileID[0].id,
        });
      const joinedData = await Promise.resolve(query.getMany());

      const result = joinedData.map((item) => {
        if (item.payment_records !== null) {
          const result = (item.payment_records as unknown as any[]).map(
            async (element) => {
              const patientpayments = new Patientpayments();
              patientpayments.branch_id = item.branch_id;
              patientpayments.patient_reception_id = item.patient_reception_id;
              patientpayments.patient_id = item.patient_id;
              patientpayments.kana_name = item.kana_name;
              patientpayments.birthday = item.birthday;
              patientpayments.burden_ratio = item.burden_ratio;
              patientpayments.patient_subburden_amount =
                item.patient_subburden_amount;
              patientpayments.patient_medical_cert_amount =
                item.patient_medical_cert_amount;
              patientpayments.patient_transportation_amount =
                item.patient_transportation_amount;
              patientpayments.patient_deposit_amount =
                item.patient_deposit_amount;
              patientpayments.payment_fee = item.payment_fee;

              patientpayments.insurance_number = item.insurance_number;
              patientpayments.insurance_name = item.insurance_name;
              patientpayments.infant_medical_recipient_number =
                item.infant_medical_recipient_number;

              patientpayments.patient_billed_amount =
                item.patient_subburden_amount +
                item.patient_medical_cert_amount +
                item.patient_transportation_amount +
                item.patient_deposit_amount +
                item.payment_fee;
              patientpayments.patient_burden_amount =
                element.patient_burden_amount;
              patientpayments.invoice_deposit_difference_amount =
                patientpayments.patient_billed_amount -
                patientpayments.patient_burden_amount;
              patientpayments.payment_status = element.payment_status;
              patientpayments.payment_method = item.payment_method;
              patientpayments.status = item.status;
              patientpayments.payment_date = element.payment_date;
              patientpayments.correction_reason = item.correction_reason;
              patientpayments.receipt_comment = item.receipt_comment;
              patientpayments.receipt_matching_result = null;
              patientpayments.billed_date = item.billed_date;
              patientpayments.billed_flag = item.billed_flag;
              patientpayments.account_id = item.account_id;
              patientpayments.created_at = new Date();
              patientpayments.updated_at = null;
              patientpayments.business_date = item.business_date;

              await this.patientpaymentsRepository.save(patientpayments);
            },
          );
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async filterPatientpayment(body) {
    let query = this.patientpaymentsRepository
      .createQueryBuilder('patient_payments')
      .leftJoinAndMapMany(
        'patient_payments.clinic_master',
        ClinicMaster,
        'clinic_master',
        'patient_payments.branch_id = clinic_master.clinic_code',
      );
    const {
      branch_id,
      business_date_start,
      business_date_end,
      patient_id,
      patient_reception_id,
      kana_name,
      birthday,
      payment_method,
      payment_date,
      billed_date,
      account_id,
    } = body;

    if (
      !business_date_start &&
      !business_date_end &&
      !patient_id &&
      !patient_reception_id &&
      !kana_name &&
      !birthday &&
      !payment_method &&
      !payment_date &&
      !billed_date &&
      !account_id &&
      branch_id
    ) {
      query = query.andWhere({ branch_id });
    }

    if (business_date_start && business_date_end) {
      query = query.andWhere({
        business_date: Between(business_date_start, business_date_end),
      });
    }

    if (patient_id) {
      query = query.andWhere({ patient_id: patient_id });
    }

    if (patient_reception_id) {
      query = query.andWhere({ patient_reception_id: patient_reception_id });
    }

    if (kana_name) {
      query = query.andWhere({ kana_name: kana_name });
    }

    if (birthday) {
      query = query.andWhere({ birthday: birthday });
    }

    if (payment_method) {
      query.andWhere({ payment_method: payment_method });
    }

    if (payment_date) {
      query.andWhere({ payment_date: payment_date });
    }

    if (billed_date) {
      query.andWhere({ billed_date: new Date(billed_date) });
    }

    if (account_id) {
      query.andWhere({ account_id: account_id });
    }

    // const matchingRows = query.getMany()
    const matchingRows = (await Promise.resolve(query.getMany())).map((row) => {
      const moment = require('moment');

      const business_date = new Date(row.business_date);
      const createdAt = moment(business_date).format('YYYY/MM/DD');

      const birthday = new Date(row.birthday);
      const createdBirthday = moment(birthday).format('YYYY/MM/DD');

      const payment_date = new Date(row.payment_date);
      const createdPayment_date = moment(payment_date).format('YYYY/MM/DD');

      const updated_at = new Date(row.updated_at);
      const createdUpdated_at = moment(updated_at).format('YYYY/MM/DD hh:mm A');

      const created_at = new Date(row.created_at);
      const createdDate = moment(created_at).format('YYYY/MM/DD hh:mm A');

      const billed_date = new Date(row.billed_date);
      const createdBilled_date = billed_date.toLocaleString('default', {
        year: 'numeric',
        month: 'numeric',
      });

      (row.business_date = createdAt),
        (row.birthday = createdBirthday),
        (row.payment_date = createdPayment_date),
        (row.billed_date = createdBilled_date),
        (row.updated_at = createdUpdated_at),
        (row.created_at = createdDate),
        (row.clinic_master = row.clinic_master[0].clinic_name);
      return row;
    });

    return matchingRows;
  }
  // hamgiin ehend patient_record utga update hiigdej bga esehiig shalgah
  //table ees update hiihed patient_record deer zasalt hiigdeh esehiig asuuh
  async updatePatientpayment(data) {
    console.log('G1', data);
    let moment = require('moment');
    const result = await this.patientpaymentsRepository.find({
      where: { id: data[0] },
    });
    console.log('result', result);
    if (result.length > 0) {
      try {
        const patientpayments = new Patientpayments();
        patientpayments.id = data[0];
        patientpayments.branch_id = result[0].branch_id;
        patientpayments.patient_reception_id = result[0].patient_reception_id;
        patientpayments.patient_id = result[0].patient_id;
        patientpayments.kana_name = result[0].kana_name;
        patientpayments.birthday = result[0].birthday;
        patientpayments.burden_ratio = result[0].burden_ratio;
        patientpayments.patient_subburden_amount =
          result[0].patient_subburden_amount;
        patientpayments.patient_medical_cert_amount =
          result[0].patient_medical_cert_amount;
        patientpayments.patient_transportation_amount =
          result[0].patient_transportation_amount;
        patientpayments.patient_deposit_amount =
          result[0].patient_deposit_amount;
        patientpayments.payment_fee = result[0].payment_fee;
        //dahin harah
        patientpayments.insurance_number = result[0].insurance_number;
        patientpayments.insurance_name = result[0].insurance_name;
        patientpayments.infant_medical_recipient_number =
          result[0].infant_medical_recipient_number;
        //dahin harah
        patientpayments.patient_billed_amount = result[0].patient_billed_amount;

        patientpayments.patient_burden_amount = data[10];
        patientpayments.payment_status = data[13];
        patientpayments.payment_date =
          new Date().getFullYear() +
          '-' +
          moment(data[14], 'MMM-D').format('MM-DD');

        patientpayments.invoice_deposit_difference_amount =
          result[0].invoice_deposit_difference_amount;
        patientpayments.payment_method = data[12];
        patientpayments.status = result[0].status;
        patientpayments.correction_reason = result[0].correction_reason;
        patientpayments.receipt_comment = result[0].receipt_comment;
        patientpayments.receipt_matching_result = data[16];
        patientpayments.billed_date = result[0].billed_date;
        patientpayments.billed_flag = result[0].billed_flag;
        patientpayments.account_id = '8888';
        patientpayments.business_date = result[0].business_date;
        patientpayments.created_at = result[0].created_at;
        patientpayments.updated_at = new Date();

        await this.patientpaymentsRepository.save(patientpayments);
      } catch (error) {
        console.log(error);
      }
    } else {
      return 'No matching result';
    }
    return data;
  }
}
