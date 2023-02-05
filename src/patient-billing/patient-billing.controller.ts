import { Controller, Post, Body, Get } from '@nestjs/common';
import { PatientBillingService } from './patient-billing.service';

@Controller('patientBilling')
export class PatientBillingController {
  constructor(private readonly PatientBillingService: PatientBillingService) {}

  @Post('filter')
  filterPatientBilling(@Body() body) {
    return this.PatientBillingService.filterPatientBilling(body);
  }

  @Post('insertPatientbill') //csv file aas orj irj bga patientBill
  insertPatientBilling(@Body() body) {
    return this.PatientBillingService.insertPatientBilling(
      body.results.data,
      body.fileName,
      body.branchId,
    );
  }

  @Post('insertNewpatientbilling') //table ees oruulj bga patientbill
  insertNewpatientbilling(@Body() body) {
    return this.PatientBillingService.insertNewpatientbilling(body.data);
  }

  @Post('patientpayment')
  filterPatientpayment(@Body() body) {
    return this.PatientBillingService.filterPatientpayment(body);
  }

  @Post('updatePatientPayment')
  updatePatientpayment(@Body() body) {
    return this.PatientBillingService.updatePatientpayment(body.data);
  }
}
