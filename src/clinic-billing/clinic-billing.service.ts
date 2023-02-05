import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicBilling } from 'src/db/entity/clinic-billing.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import * as moment from 'moment';
import { VBToggle } from 'bootstrap-vue';
@Injectable()
export class ClinicBillingService {
  constructor(
    @InjectRepository(ClinicBilling)
    private readonly clinicBillingRepository: Repository<ClinicBilling>,
    @InjectRepository(ClinicMaster)
    private readonly clinicMasterRepository: Repository<ClinicMaster>,
  ) {}

  async filterClinicBilling(filterValues) {
    let query =
      this.clinicBillingRepository.createQueryBuilder('clinic_billing');

    const {
      branch_id,
      business_date,
      insurance_type,
      this_month,
      patient_id,
      name,
      correction_reason,
      refund_assessment_month,
      account_id,
    } = filterValues;

    if (
      !business_date &&
      !insurance_type &&
      !this_month &&
      !patient_id &&
      !name &&
      !correction_reason &&
      !refund_assessment_month &&
      !account_id &&
      branch_id
    ) {
      query = query.andWhere('clinic_billing.branch_id = :branch_id', {
        branch_id,
      });
    }

    // if (branch_id) {
    //   query.andWhere('clinic_billing.branch_id = :branch_id', {
    //     branch_id: branch_id,
    //   });
    // }

    if (business_date) {
      const moment = require('moment');
      query = query.andWhere('clinic_billing.business_date = :business_date', {
        business_date: moment(business_date).format('YYYY-MM-DD'),
      });
    }

    if (insurance_type) {
      query = query.andWhere(
        'clinic_billing.insurance_type = :insurance_type',
        {
          insurance_type: insurance_type,
        },
      );
    }

    if (this_month) {
      query = query.andWhere('clinic_billing.this_month = :this_month', {
        this_month: this_month,
      });
    }

    if (patient_id) {
      query = query.andWhere('clinic_billing.patient_id = :patient_id', {
        patient_id: patient_id,
      });
    }

    if (name) {
      query = query.andWhere('clinic_billing.name = :name', {
        name: name,
      });
    }

    if (correction_reason) {
      query = query.andWhere(
        'clinic_billing.correction_reason = :correction_reason',
        {
          correction_reason: correction_reason,
        },
      );
    }

    if (refund_assessment_month) {
      query = query.andWhere(
        'clinic_billing.refund_assessment_month = :refund_assessment_month',
        {
          refund_assessment_month: refund_assessment_month,
        },
      );
    }

    // if (filterValues.account_id) {
    //   query = query.andWhere('clinic_billing.account_id = :account_id', {
    //     account_id: filterValues.account_id,
    //   });
    // }

    if (filterValues.billed_flag) {
      query = query.andWhere('clinic_billing.billed_flag = :billed_flag', {
        billed_flag: filterValues.billed_flag,
      });
    }

    if (filterValues.billed_date) {
      query = query.andWhere('clinic_billing.billed_date = :billed_date', {
        billed_date: filterValues.billed_date,
      });
    }
    // query = query.innerJoin(
    //   'clinic_master',
    //   'clinic_billing.branch_id = clinic_master.clinic_code',
    // );

    const matchingRows = (await query.getMany()).map((row) => {
      // const businessDate = new Date(row.business_date);
      // const month = businessDate.toLocaleString('default', { month: 'short' });
      // const day = businessDate.getDate();

      // const refundMonth = new Date(row.refund_assessment_month);
      // const refundMonthString = refundMonth.toLocaleString('default', {
      //   month: 'short',
      // });
      // const refundDay = refundMonth.getDate();
      const date = new Date(row.created_at);

      const moment = require('moment');
      const createdAt = moment(date).format('YYYY/MM/DD HH:mm');
      // row.business_date = `${month}-${day}`;
      row.business_date = moment(row.business_date).format('YYYY/MM');
      row.created_at = createdAt;
      row.billed_date = moment(row.billed_date).format('YYYY/MM');
      // row.refund_assessment_month = `${refundMonthString}-${refundDay}`;
      return row;
    });

    return matchingRows;
  }
}
