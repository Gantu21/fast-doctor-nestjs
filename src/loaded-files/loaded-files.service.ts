import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, Any } from 'typeorm';

import moment from 'moment';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
// import Encoding from 'encoding-japanese';
import { PaymentRecords } from 'src/db/entity/payment-records.entity';
import { LoadedFiles } from 'src/db/entity/loaded-files.entity';
import { ClinicBilling } from 'src/db/entity/clinic-billing.entity';
import { FixedValues } from 'src/db/entity/fixed-values.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import { InsuranceNameMaster } from 'src/db/entity/insurance-name-master.entity';
@Injectable()
export class LoadedFilesService {
  constructor(
    @InjectRepository(LoadedFiles)
    private readonly loadedFilesRepository: Repository<LoadedFiles>,
    @InjectRepository(ClinicBilling)
    private readonly clinicBillingRepository: Repository<ClinicBilling>,
    @InjectRepository(PaymentRecords)
    private readonly paymentRecordsRepository: Repository<PaymentRecords>,
    @InjectRepository(FixedValues)
    private readonly fixedValuesRepository: Repository<FixedValues>,
    @InjectRepository(ClinicMaster)
    private readonly clinicMasterRepository: Repository<ClinicMaster>,
    @InjectRepository(InsuranceNameMaster)
    private readonly insuranceNameMasterRepository: Repository<InsuranceNameMaster>,
  ) {}

  // storage deer hadgalah bolon postgres loaded_files deer hadgalah
  async uploadFile(file: any, accountId: any, fileType): Promise<void> {
    const Encoding = require('encoding-japanese');
    const directoryPath = `/Users/oilkii/Documents/fast-files`;
    const files = fs.readdirSync(directoryPath);
    const encodedFileName = Encoding.convert(file.originalname, {
      to: 'UNICODE',
      from: 'UTF8',
    });

    const csvFile = files.find((folderfile) => folderfile === encodedFileName);
    const found = csvFile !== undefined;
    // const fileType = fileCategory === '保険別請求明細表' ? 1 : 0;
    return new Promise((resolve, reject) => {
      try {
        if (!found) {
          fs.writeFileSync(
            `/Users/oilkii/Documents/fast-files/${encodedFileName}`,
            file.buffer,
          );
        } else {
          resolve('File Exists');
        }
        resolve(encodedFileName);
      } catch (error) {
        reject(error);
      }
    }).then(async (result: any) => {
      if (result === encodedFileName) {
        const loadedFile = new LoadedFiles();
        loadedFile.file_name = encodedFileName;
        loadedFile.file_type = fileType;
        loadedFile.status = 2;
        loadedFile.account_id = accountId;
        loadedFile.created_at = new Date();
        loadedFile.file_path = '/Users/oilkii/Documents/fast-files/';
        await this.loadedFilesRepository.save(loadedFile);
      }
      return result;
    });
  }

  async checkCsvFile(data, branchId) {
    // const rows = await data.map(async (item) => {
    //   const result = await this.clinicBillingRepository
    //     .createQueryBuilder('clinic_billing')
    //     .where(
    //       `clinic_billing.branch_id = :branch_id AND
    //         to_char(clinic_billing.business_date, 'yyyymm') = :business_date AND
    //         clinic_billing.patient_id = :patient_id`,
    //       {
    //         branch_id: branchId,
    //         business_date:
    //           item[4] === '診療年月' || item[4] === ''
    //             ? null
    //             : (item[4] = new Date(item[4]).toISOString().substring(0, 10)),
    //         patient_id: item[12] == '' || isNaN(item[12]) ? null : item[12],
    //       },
    //     )
    //     .getMany();
    // });
    // console.log(rows.length);

    const matchedRows = await Promise.all(
      data.map(async (row) => {
        const moment = require('moment');
        const matchedClinicBilling = await this.clinicBillingRepository.find({
          where: {
            branch_id: branchId,
            business_date:
              row[4] === '診療年月' ||
              row[4] === '' ||
              moment(row[4], 'YYYY/MM').format('YYYY-MM-DD') === 'Invalid date'
                ? null
                : moment(row[4], 'YYYY/MM').format('YYYY-MM-DD'),
            patient_id: row[12] == '' || isNaN(row[12]) ? null : row[12],
          },
        });

        const date = new Date();
        const createdAt = moment(date).format('YYYY/MM/DD HH:mm');
        row.push(createdAt);
        if (matchedClinicBilling.length > 0) {
          return row; //return the original data row
        }
      }),
    );
    // console.log(
    //   'matchedrow-->',
    //   matchedRows.filter((row) => row !== undefined).length,
    // );
    return matchedRows.filter((row) => row !== undefined);
  }
  // async checkCsvFile(data, branchId) {
  //   // return data;

  //   const rows = await Promise.all(
  //     data.map(async (row) => {
  //       console.log('--->', row[4].substring(0, 4));
  //       console.log(new Date(row[4]).toISOString().substring(0, 10));

  //       return await this.clinicBillingRepository.find({
  //         where: {
  //           branch_id: branchId,
  //           business_date:
  //             row[4] === '診療年月' || row[4] === ''
  //               ? null
  //               : (row[4] = new Date(row[4]).toISOString().substring(0, 10)),
  //           patient_id: row[12] == '' || isNaN(row[12]) ? null : row[12],
  //         },
  //       });
  //     }),
  //   );
  //   return rows.filter((row) => row.length > 0);
  // }

  // postgres deer hadgalah
  async uploadCsvData(data, fileName, branch_id) {
    // const dataToInsert = data.slice(1);
    const Encoding = require('encoding-japanese');
    const moment = require('moment');
    const currentDate = moment();

    // let insurance = await this.insuranceNameMasterRepository.findOne({
    //   where: {
    //     insurance_number: `0${data[1][15].substring(0, 1)}`,
    //   },
    // });
    // console.log('testing-->', `0${data[1][15].substring(0, 1)}`);

    // console.log(insurance);

    let insurance_number =
      data[708][15] && data[708][15].toString().length === 8
        ? data[708][15].toString().substring(0, 2)
        : data[708][15] && data[1][15].toString().length === 7
        ? `0${data[708][15].toString().substring(0, 1)}`
        : data[708][15] && data[708][15].toString().length === 6
        ? '00'
        : null;
    let insurance = await this.insuranceNameMasterRepository.findOne({
      where: {
        insurance_number: insurance_number,
      },
    });
    console.log(insurance_number, insurance);
    let encodedFileName = Encoding.convert(fileName, {
      to: 'UNICODE',
      from: 'auto',
    });
    const fileID = await this.loadedFilesRepository.find({
      where: { file_name: encodedFileName },
    });

    try {
      for (const item of data) {
        if (
          item[1] === '帳票区分' ||
          item[11] === '　　小　計' ||
          item[11] === '　　合　計' ||
          item[11] === '保険区分'
        ) {
          continue;
        }
        let insurance_number =
          item[15] && item[15].toString().length === 8
            ? item[15].toString().substring(0, 2)
            : item[15] && item[15].toString().length === 7
            ? `0${item[15].toString().substring(0, 1)}`
            : item[15] && item[15].toString().length === 6
            ? '00'
            : null;

        // console.log('num------>', `0${data[3][15].substring(0, 2)}`);
        let insurance = await this.insuranceNameMasterRepository.findOne({
          where: {
            insurance_number: insurance_number,
          },
        });
        // console.log(insurance);

        const clinicBilling = new ClinicBilling();
        clinicBilling.branch_id = branch_id;
        clinicBilling.business_date =
          item[4] === '' ||
          moment(item[4], 'YYYY/MM').format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : (item[4] = moment(item[4], 'YYYY/MM').format('YYYY-MM-DD'));

        clinicBilling.form_type = item[1];
        clinicBilling.this_month = item[8];
        clinicBilling.insurance_type = item[11];
        clinicBilling.patient_id =
          item[12] == '' || isNaN(item[12]) ? null : item[12];
        clinicBilling.name = item[13];
        clinicBilling.numbers =
          item[14] == '' || isNaN(item[14]) ? null : item[14];
        clinicBilling.insurance_number = item[15] == '' ? null : item[15];
        clinicBilling.insurance_name = insurance
          ? insurance.insurance_name
          : null;
        clinicBilling.days_number =
          item[18] == '' || isNaN(item[18]) ? null : item[18];
        clinicBilling.points =
          item[19] == '' || isNaN(item[19]) ? null : item[19];
        clinicBilling.patient_burden_amount =
          item[20] === '' || isNaN(item[20]) ? null : item[20];
        clinicBilling.insurance_amount =
          item[21] === '' || isNaN(item[21]) ? null : item[21];
        clinicBilling.public_amount =
          item[22] === '' || isNaN(item[22]) ? null : item[22];
        clinicBilling.insurance_income =
          item[23] === '' || isNaN(item[23]) ? null : item[23];
        clinicBilling.billed_date = moment(new Date())
          .subtract(4, 'month')
          .startOf('month')
          .format('YYYY-MM-DD');
        clinicBilling.billed_flag = false;
        clinicBilling.account_id = '9999'; // buruu account id zasah
        clinicBilling.loaded_files_id = fileID[0].id;
        clinicBilling.created_at = new Date();
        clinicBilling.updated_at = new Date();
        await this.clinicBillingRepository.save(clinicBilling);
      }
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  async uploadGmoData(data, fileName, branchId, paymentDate) {
    const dataToInsert = data.slice(1);
    const fileID = await this.loadedFilesRepository.find({
      where: { file_name: fileName },
    });
    try {
      for (const item of dataToInsert) {
        const paymentRecords = new PaymentRecords();
        paymentRecords.patient_reception_id = item[1];
        paymentRecords.branch_id = branchId;
        paymentRecords.payment_status = item[2];
        paymentRecords.payment_method = 'GMO';
        paymentRecords.patient_burden_amount =
          item[2] == '即時売上'
            ? item[4]
            : item[2] == '月跨返品'
            ? -item[4]
            : item[2] == '実売上'
            ? item[4]
            : item[2] == '返品'
            ? -item[4]
            : item[2] == '取消'
            ? -item[4]
            : null;
        paymentRecords.payment_date = paymentDate;
        paymentRecords.account_id = '9999';
        paymentRecords.loaded_files_id = fileID[0].id;
        paymentRecords.created_at = new Date();
        await this.paymentRecordsRepository.save(paymentRecords);
      }
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  async uploadNpData(data, fileName, branchId, paymentDate) {
    // return data;
    const dataToInsert = data.slice(1);
    const fileID = await this.loadedFilesRepository.find({
      where: { file_name: fileName },
    });
    try {
      for (const item of dataToInsert) {
        if (
          item[0] == '19：立替払い対象取引小計' ||
          item[0] == '29：カード決済手数料小計' ||
          item[0] == '39：支払後キャンセル取引小計' ||
          item[0] == '49：ご返金明細小計' ||
          item[0] == '50：その他相殺額詳細' ||
          item[0] == '59：その他相殺額小計' ||
          item[0] == '96：立替払い計' ||
          item[0] == '97：発生費用計' ||
          item[0] == '98：前回繰越額' ||
          item[0] == '99：お支払総額'
        ) {
          return;
        } else {
          // console.log('item', item[6]);
          const paymentRecords = new PaymentRecords();
          paymentRecords.patient_reception_id = item[6];
          paymentRecords.branch_id = branchId;
          paymentRecords.payment_status = item[0];
          paymentRecords.payment_method = 'NP';
          paymentRecords.patient_burden_amount =
            item[0] == '10：立替払い対象取引詳細' && item[8]
              ? item[8]
              : item[0] == '30：支払後キャンセル取引詳細' && item[8]
              ? -item[8]
              : item[0] == '40：ご返金明細詳細' && item[8]
              ? item[8]
              : null;
          paymentRecords.payment_date = paymentDate;
          paymentRecords.account_id = '9999';
          paymentRecords.loaded_files_id = fileID[0].id;
          paymentRecords.created_at = new Date();
          await this.paymentRecordsRepository.save(paymentRecords);
          // return 'success';
        }
      }
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  // async uploadHenData(data: any, fileName) {
  //   const fileID = await this.loadedFilesRepository.find({
  //     where: { file_name: fileName },
  //   });

  //   const HI = data.filter((subArr) => subArr.includes('HI'));
  //   const RE = data.filter((subArr) => subArr.includes('RE'));

  //   return await RE.forEach(async (arr, i) => {
  //     const result = await this.clinicBillingRepository
  //       .createQueryBuilder('clinic_billing')
  //       .where(
  //         `clinic_billing.branch_id = :branch_id AND
  //         to_char(clinic_billing.business_date, 'yyyymm') = :business_date AND
  //         clinic_billing.patient_id = :patient_id`,
  //         {
  //           branch_id: HI[0][5],
  //           business_date: arr[RE[i].indexOf('RE') + 3],
  //           patient_id: arr[RE[i].indexOf('RE') + 13].substring(3),
  //         },
  //       )
  //       .getMany();
  //     if (result.length > 0) {
  //       try {
  //         const clinicBilling = new ClinicBilling();
  //         clinicBilling.branch_id = HI[0][5];
  //         clinicBilling.business_date = new Date(
  //           parseInt(arr[RE[i].indexOf('RE') + 3].substring(0, 4)),
  //           parseInt(arr[RE[i].indexOf('RE') + 3].substring(4, 6)) - 1,
  //         ).toLocaleDateString();
  //         clinicBilling.form_type = result[0].form_type;
  //         clinicBilling.insurance_type = result[0].insurance_type;
  //         clinicBilling.this_month = result[0].this_month;
  //         clinicBilling.patient_id = arr[RE[i].indexOf('RE') + 13];
  //         clinicBilling.name = result[0].name;
  //         clinicBilling.numbers = -result[0].numbers;
  //         clinicBilling.days_number = -result[0].days_number;
  //         clinicBilling.points = -result[0].points;
  //         clinicBilling.patient_burden_amount =
  //           -result[0].patient_burden_amount;
  //         clinicBilling.insurance_amount = -result[0].insurance_amount;
  //         clinicBilling.insurance_income =
  //           (result[0].patient_burden_amount +
  //             result[0].insurance_amount +
  //             result[0].public_amount) *
  //           -1;
  //         clinicBilling.public_amount = -result[0].public_amount;
  //         clinicBilling.refund_assessment_month = new Date();
  //         clinicBilling.claim_approval_flag = result[0].claim_approval_flag;
  //         clinicBilling.billed_flag = true;
  //         clinicBilling.billed_date = result[0].billed_date;
  //         clinicBilling.account_id = result[0].account_id;
  //         clinicBilling.loaded_files_id = fileID[0].id;
  //         clinicBilling.created_at = new Date();
  //         clinicBilling.updated_at = result[0].updated_at;
  //         await this.clinicBillingRepository.save(clinicBilling);
  //         return 'success';
  //       } catch (error) {
  //         console.log(error);
  //         return 'Error';
  //       }
  //     } else {
  //       return 'No matching result';
  //     }
  //   });
  // }

  async uploadHenData(data: any, fileName) {
    const moment = require('moment');
    const fileID = await this.loadedFilesRepository.find({
      where: { file_name: fileName },
    });

    const HI = data.filter((subArr) => subArr.includes('HI'));
    const RE = data.filter((subArr) => subArr.includes('RE'));

    const results = await Promise.all(
      RE.map(async (arr, i) => {
        const result = await this.clinicBillingRepository
          .createQueryBuilder('clinic_billing')
          .where(
            `clinic_billing.branch_id = :branch_id AND
        to_char(clinic_billing.business_date, 'yyyymm') = :business_date AND
        clinic_billing.patient_id = :patient_id`,
            {
              branch_id: HI[0][5],
              business_date: arr[RE[i].indexOf('RE') + 3],
              patient_id: arr[RE[i].indexOf('RE') + 13],
            },
          )
          .getMany();
        console.log('result -->', result);
        console.log('RE----->', arr[RE[i].indexOf('RE') + 3]);
        console.log('HI----->', arr[RE[i].indexOf('RE') + 13]);
        if (result.length > 0) {
          try {
            const clinicBilling = new ClinicBilling();
            clinicBilling.branch_id = HI[0][5];
            clinicBilling.business_date = new Date(
              parseInt(arr[RE[i].indexOf('RE') + 3].substring(0, 4)),
              parseInt(arr[RE[i].indexOf('RE') + 3].substring(4, 6)) - 1,
            ).toLocaleDateString();
            clinicBilling.form_type = result[0].form_type;
            clinicBilling.insurance_type = result[0].insurance_type;
            clinicBilling.this_month = result[0].this_month;
            clinicBilling.patient_id = arr[RE[i].indexOf('RE') + 13];
            clinicBilling.name = result[0].name;
            clinicBilling.insurance_number = result[0].insurance_number;
            clinicBilling.insurance_name = result[0].insurance_name;
            clinicBilling.numbers = -result[0].numbers;
            clinicBilling.days_number = -result[0].days_number;
            clinicBilling.points = -result[0].points;
            clinicBilling.patient_burden_amount =
              -result[0].patient_burden_amount;
            clinicBilling.insurance_amount = -result[0].insurance_amount;
            clinicBilling.insurance_income =
              (result[0].patient_burden_amount +
                result[0].insurance_amount +
                result[0].public_amount) *
              -1;
            clinicBilling.public_amount = -result[0].public_amount;

            clinicBilling.refund_assessment_month = moment(new Date()).format(
              'YYYY-MM-DD',
            );
            clinicBilling.correction_reason = '返戻';
            clinicBilling.claim_approval_flag = result[0].claim_approval_flag;
            clinicBilling.billed_flag = true;
            clinicBilling.billed_date = result[0].billed_date;
            clinicBilling.account_id = result[0].account_id;
            clinicBilling.loaded_files_id = fileID[0].id;
            clinicBilling.created_at = new Date();
            clinicBilling.updated_at = result[0].updated_at;

            await this.clinicBillingRepository.save(clinicBilling);
            return 'success';
          } catch (error) {
            console.log(error);
            return 'Error';
          }
        } else {
          return 'No matching result';
        }
      }),
    );
  }

  async uploadSahData(data: any, fileName) {
    const moment = require('moment');

    const fileID = await this.loadedFilesRepository.find({
      where: { file_name: fileName },
    });
    const IR = data.filter((subArr) => subArr.join('').indexOf('120IR') > -1);
    const RE = data.filter((subArr) => subArr.join('').indexOf('130RE') > -1);

    const rows = await RE.forEach(async (arr, i) => {
      console.log('re--->', arr[RE[i].indexOf('RE') + 3]);
      console.log('patient id', arr[RE[i].indexOf('RE') + 13]);
      console.log('IR', IR[i][7]);
      const result = await this.clinicBillingRepository
        .createQueryBuilder('clinic_billing')
        .where(
          `clinic_billing.branch_id = :branch_id AND
            to_char(clinic_billing.business_date, 'yyyymm') = :business_date AND
            clinic_billing.patient_id = :patient_id`,
          {
            branch_id: IR[i][7],
            business_date: arr[RE[i].indexOf('RE') + 3],
            patient_id: arr[RE[i].indexOf('RE') + 13],
          },
        )
        .getMany();
      console.log('result -->', result);
      if (result.length > 0) {
        try {
          console.log('first');
          const clinicBilling = new ClinicBilling();
          clinicBilling.branch_id = IR[i][7];
          clinicBilling.business_date = new Date(
            parseInt(arr[RE[i].indexOf('RE') + 3].substring(0, 4)),
            parseInt(arr[RE[i].indexOf('RE') + 3].substring(4, 6)) - 1,
          ).toLocaleDateString();
          clinicBilling.form_type = result[0].form_type;
          clinicBilling.insurance_type = result[0].insurance_type;
          clinicBilling.this_month = result[0].this_month;
          clinicBilling.patient_id = arr[RE[i].indexOf('RE') + 13];
          clinicBilling.name = result[0].name;
          clinicBilling.insurance_number = result[0].insurance_number;
          clinicBilling.insurance_name = result[0].insurance_name;
          clinicBilling.numbers = -result[0].numbers;
          clinicBilling.days_number = -result[0].days_number;
          clinicBilling.points = -result[0].points;
          clinicBilling.patient_burden_amount =
            -result[0].patient_burden_amount;
          clinicBilling.insurance_amount = -result[0].insurance_amount;
          clinicBilling.public_amount = -result[0].public_amount;
          clinicBilling.insurance_income =
            (result[0].patient_burden_amount +
              result[0].insurance_amount +
              result[0].public_amount) *
            -1;
          clinicBilling.refund_assessment_month = moment(new Date()).format(
            'YYYY-MM-DD',
          );
          clinicBilling.correction_reason = '返戻';
          clinicBilling.claim_approval_flag = result[0].claim_approval_flag;
          clinicBilling.billed_flag = true;
          clinicBilling.billed_date = result[0].billed_date;
          clinicBilling.account_id = result[0].account_id;
          clinicBilling.loaded_files_id = fileID[0].id;
          clinicBilling.created_at = new Date();
          clinicBilling.updated_at = result[0].updated_at;
          await this.clinicBillingRepository.save(clinicBilling);
        } catch (error) {
          console.log(error);
        }
      } else {
        return 'No matching result';
      }
    });
  }

  async uploadOption5Data(data: any, fileName, branchId) {
    const fileID = await this.loadedFilesRepository.find({
      where: { file_name: fileName },
    });
    const moment = require('moment');
    const dataToInsert = data.slice(1);
    await dataToInsert.forEach(async (arr, i) => {
      const result = await this.clinicBillingRepository
        .createQueryBuilder('clinic_billing')
        .where(
          `clinic_billing.branch_id = :branch_id AND
            to_char(clinic_billing.business_date, 'yyyymm') = :business_date AND
            clinic_billing.patient_id = :patient_id`,
          {
            branch_id: branchId,
            business_date: dataToInsert[i][0],
            patient_id: dataToInsert[i][4],
          },
        )
        .getMany();
      if (result.length > 0) {
        try {
          const clinicBilling = new ClinicBilling();
          clinicBilling.branch_id = branchId;
          clinicBilling.business_date = moment(
            dataToInsert[i][0],
            'YYYYMM',
          ).format('YYYY-MM-DD');
          clinicBilling.form_type = result[0].form_type;
          clinicBilling.insurance_type = result[0].insurance_type;
          clinicBilling.this_month = result[0].this_month;
          clinicBilling.patient_id = dataToInsert[i][4];
          clinicBilling.name = result[0].name;
          clinicBilling.numbers = 0;
          clinicBilling.days_number = 0;
          clinicBilling.points = dataToInsert[i][8];
          clinicBilling.patient_burden_amount = dataToInsert[i][9];
          clinicBilling.insurance_amount = dataToInsert[i][10];
          clinicBilling.public_amount = dataToInsert[i][11];
          clinicBilling.insurance_income = dataToInsert[i][12];
          clinicBilling.correction_reason = dataToInsert[i][13];
          clinicBilling.refund_assessment_month = new Date().toISOString();
          clinicBilling.claim_approval_flag = result[0].claim_approval_flag;
          clinicBilling.billed_flag = true;
          clinicBilling.billed_date = result[0].billed_date;
          clinicBilling.account_id = result[0].account_id;
          clinicBilling.loaded_files_id = fileID[0].id;
          clinicBilling.created_at = new Date();
          clinicBilling.updated_at = result[0].updated_at;
          await this.clinicBillingRepository.save(clinicBilling);
        } catch (error) {
          console.log(error);
        }
      } else {
        return 'No matching result';
      }
    });
  }

  // loaded_file aas songogdson udurt oruulsan file name iig oloh
  async getFileRows(startDateValue: Date, endDateValue: Date, fileType) {
    const rows = await this.loadedFilesRepository.find({
      where: {
        file_type: fileType,
        deleted_at: IsNull(),
        created_at: Between(startDateValue, endDateValue),
      },
    });
    return rows;
  }

  // storage aas file iig oloh
  async getFile(fileId: any, fileType) {
    console.log(fileId, fileType);
    if (fileType == '1' || fileType == '6' || fileType == '7') {
      try {
        // const rows = await this.clinicBillingRepository.find({
        //   where: { loaded_files_id: fileId },
        //   relations: ['clinicMaster'],
        // });
        // console.log('rows-->', rows);

        // const rows = await this.clinicBillingRepository
        //   .createQueryBuilder('clinic_billing')
        //   .leftJoin('clinic_billing.clinic', 'clinic')
        //   .addSelect('clinic.clinic_name', 'clinic_billing.loaded_files_id')
        //   .where('clinic_billing.loaded_files_id = :loaded_files_id', {
        //     loaded_files_id: fileId,
        //   })
        //   .andWhere('clinic_billing.branch_id = clinic.clinic_code')
        //   .getMany();

        // const rows = await this.clinicBillingRepository
        //   .createQueryBuilder('clinic_billing')
        //   .leftJoin(
        //     'clinic_master',
        //     'clinic_billing',
        //     'clinic',
        //     'clinic.clinic_code = clinic_billing.branch_id',
        //   )
        //   .addSelect('clinic_billing.loaded_files_id')
        //   .where('clinic_billing.loaded_files_id = :loaded_files_id', {
        //     loaded_files_id: fileId,
        //   })
        //   .getMany();

        // const rows = await this.clinicBillingRepository

        // .select(['clinic_billing.*', 'clinic_master.clinic_name'])
        // .leftJoin(
        //   'clinic_master',
        //   'clinic_master',
        //   'clinic_billing.branch_id = clinic_master.clinic_code',
        // )
        // .where('clinic_billing.branch_id = clinic_master.clinic_code')
        // .getMany();

        // const rows = await this.clinicBillingRepository
        //   // .createQueryBuilder('clinic_billing')
        //   // .leftJoinAndSelect(
        //   //   'clinic_billing.clinic',
        //   //   'clinic_master.clinc_name',
        //   // )
        //   // .getMany();
        //   // .leftJoin('clinic_billing.clinic', 'clinic')
        //   // .addSelect('clinic.clinic_name', 'clinic_billing.loaded_files_id')
        //   // .where('clinic_billing.loaded_files_id = :loaded_files_id', {
        //   //   loaded_files_id: fileId,
        //   // })
        //   // .andWhere('clinic_billing.branch_id = clinic.clinic_code')
        //   .getMany();
        const rows = await this.clinicBillingRepository.find({
          where: { loaded_files_id: fileId },
        });
        // console.log('rows->', rows);
        // rows.map((row) => {
        //   const clinic = this.clinicMasterRepository.findOne({
        //     where: {
        //       clinic_code: row.branch_id,
        //     },
        //   });
        // });
        return rows;
      } catch (error) {
        console.log(error);
        // }
      }
    } else if (fileType == '4' || fileType == '5') {
      try {
        const rows = await this.paymentRecordsRepository.find({
          where: { loaded_files_id: fileId },
        });
        return rows;
      } catch (error) {
        console.log(error);
        // }
      }
    } else if (fileType == '8') {
      try {
        const rows = await this.clinicBillingRepository.find({
          where: { loaded_files_id: fileId },
        });
        return rows;
      } catch (error) {
        console.log(error);
        // }
      }
    }

    // const directoryPath = `/Users/oilkii/Documents/fast-files`;
    // const files = fs.readdirSync(directoryPath);
    // const csvFile = files.filter((file) => file === fileName);
    // if (csvFile.length > 0) {
    // return {
    //   status: 'success',
    //   csvFileArrl: csvFile.map((csvFile) => {
    //     const file = fs.readFileSync(
    //       path.join(directoryPath, csvFile),
    //       'utf8',
    //     );
    //     // console.log(Papa.parse(file, options).meta);
    //     return Papa.parse(file, {
    //       header: true,
    //     });
    //   }),
    // };
    // } else {
    // throw new Error('File not found');
    // }
  }

  async uploadUpdatedClinicBillingData(data, fileName, branchId) {
    console.log('update data', data);
    let moment = require('moment');
    await data.forEach(async (arr, i) => {
      const result = await this.clinicBillingRepository
        .createQueryBuilder('clinic_billing')
        .where(`clinic_billing.id = :id`, {
          id: data[i][0],
        })
        .getMany();
      if (result.length > 0) {
        try {
          const clinicBilling = new ClinicBilling();
          clinicBilling.branch_id = result[0].branch_id;
          clinicBilling.business_date = result[0].business_date;
          clinicBilling.form_type = data[i][4];
          clinicBilling.insurance_type = data[i][5];
          clinicBilling.this_month = result[0].this_month;
          clinicBilling.patient_id = result[0].patient_id;
          clinicBilling.name = result[0].name;
          clinicBilling.numbers = 0;
          clinicBilling.days_number = 0;
          clinicBilling.points = data[i][11];
          clinicBilling.patient_burden_amount = data[i][12];
          clinicBilling.insurance_amount = data[i][13];
          clinicBilling.public_amount = data[i][14];
          clinicBilling.insurance_income = result[0].insurance_income;
          clinicBilling.correction_reason = data[i][16];
          clinicBilling.refund_assessment_month =
            new Date().getFullYear() +
            '-' +
            moment(data[i][17], 'MMM-D').format('MM-DD');

          // clinicBilling.claim_approval_flag = result[0].claim_approval_flag;
          clinicBilling.billed_flag = data[i][18];
          clinicBilling.billed_date = result[0].billed_date;
          clinicBilling.account_id = result[0].account_id;
          clinicBilling.loaded_files_id = result[0].loaded_files_id;
          clinicBilling.created_at = new Date();
          clinicBilling.updated_at = null;
          await this.clinicBillingRepository.save(clinicBilling);
        } catch (error) {
          console.log(error);
        }
      } else {
        return 'No matching result';
      }
    });
    return data;
  }

  async deleteFile(fileName: any): Promise<void> {
    const row = await this.loadedFilesRepository.find({
      where: { file_name: fileName },
    });
    // const num = parseInt(row[0].id)
    try {
      await fs.promises
        .unlink(`/Users/oilkii/Documents/fast-files/${fileName}`)
        .then(async () => {
          await this.loadedFilesRepository.update(
            { file_name: fileName },
            { deleted_at: new Date() },
          );
        })
        .then(() =>
          this.clinicBillingRepository.delete({ loaded_files_id: row[0].id }),
        );
    } catch (error) {
      throw new Error(`Error deleting file: ${error}`);
    }
  }

  // fixed value
  async uploadFIxedValueData(data, filename, accountId) {
    const FixedData = data.slice(1);
    for (const item of FixedData) {
      const fixedValues = new FixedValues();
      fixedValues.branch_id = 1234;
      fixedValues.clinic_name = item[0];
      fixedValues.item_2 = item[1];
      fixedValues.item_3 = item[2];
      fixedValues.item_4 = item[3];
      fixedValues.fixed_value = item[4];
      fixedValues.account_id = 8888;
      fixedValues.created_at = new Date();
      await this.fixedValuesRepository.save(fixedValues);
    }
    // return 'success'
  }
  async searchFixedValue(account_id, startDate: Date, endDate: Date) {
    const fixedData = await this.fixedValuesRepository.find({
      where: {
        created_at: Between(startDate, endDate),
        account_id: account_id,
      },
    });
    // const data = fixedData
    return fixedData;
  }

  async deleteById(body) {
    const data = await this.fixedValuesRepository.remove(body);
    return data;
  }
}
