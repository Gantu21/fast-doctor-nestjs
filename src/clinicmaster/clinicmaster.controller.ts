import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClinicmasterService } from './clinicmaster.service';
@Controller('clinicmaster')
export class ClinicmasterController {
  constructor(private readonly clinicMasterService: ClinicmasterService) {}
  @Get('getall')
  getAllClinics() {
    return this.clinicMasterService.getAllClinics();
  }

  @Post('/getclinicname')
  getOneClinic(@Body() body) {
    return this.clinicMasterService.getOneClinic(body.branchId);
  }

  @Post('new')
  insertNewClinic(@Body() body) {
    return this.clinicMasterService.insertNewClinic(body);
  }

  // @Post('/clinicname')
  // ClinicData(@Body() body) {
  //   return this.ClinicMaster.ClinicData(body)
  // }

  @Post('/searchClinicName')
  SearchClinicName(@Body() body) {
    return this.clinicMasterService.SearchClinicName(body);
  }

  @Post('/deleteClinicNameById')
  deleteItem(@Body() body) {
    return this.clinicMasterService.deleteItem(body);
  }

  @Post('/updateClinicNameById')
  updateItem(@Body() body) {
    return this.clinicMasterService.updateItem(body);
  }
}
