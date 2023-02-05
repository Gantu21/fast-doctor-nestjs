import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { LoadedFilesService } from './loaded-files.service';
import { PrintService } from 'src/print/print.service';

@Controller()
export class LoadedFilesController {
  constructor(
    private readonly loadedFilesService: LoadedFilesService,
    private readonly printService: PrintService,
  ) {}
  @Post('getfile')
  getFile(@Body() body) {
    return this.loadedFilesService.getFile(body.fileId, body.fileType);
  }

  @Post('checkcsvfile')
  checkCsvFile(@Body() body) {
    return this.loadedFilesService.checkCsvFile(body.results, body.branchId);
  }

  @Post('getfilerows')
  getFileRows(@Body() body) {
    return this.loadedFilesService.getFileRows(
      body.startDateValue,
      body.endDateValue,
      body.fileType,
    );
  }

  @Post('uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() body, @UploadedFile() file) {
    const { accountId, fileType } = body;
    return this.loadedFilesService.uploadFile(file, accountId, fileType);
  }

  @Post('uploadcsvdata')
  uploadCsvData(@Body() body) {
    return this.loadedFilesService.uploadCsvData(
      body.results,
      body.fileName,
      body.branchId,
    );
  }

  @Post('uploadgmodata')
  uploadGmoData(@Body() body) {
    return this.loadedFilesService.uploadGmoData(
      body.results.data,
      body.fileName,
      body.branchId,
      body.paymentDate,
    );
  }

  @Post('uploadnpdata')
  uploadNpData(@Body() body) {
    return this.loadedFilesService.uploadNpData(
      body.results.data,
      body.fileName,
      body.branchId,
      body.paymentDate,
    );
  }
  // @Post('uploadfile')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file) {
  //   return this.loadedFilesService.uploadFile(file);
  // }

  // @Post('uploadfilehen')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFileHen(@Body() body, @UploadedFile() file) {
  //   const { accountId, fileType } = body;
  //   return this.loadedFilesService.uploadFileHen(file, accountId, fileType);
  // }

  // @Post('uploadfilesah')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFileSeh(@Body() body, @UploadedFile() file) {
  //   const { accountId, fileType } = body;
  //   return this.loadedFilesService.uploadFileSah(file, accountId, fileType);
  // }

  // @Post('uploadfileoption5')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFileOption5(@Body() body, @UploadedFile() file) {
  //   console.log('first');
  //   const { accountId, fileType } = body;
  //   return this.loadedFilesService.uploadFileOption5(file, accountId, fileType);
  // }
  @Post('uploadhendata')
  async uploadHenData(@Body() body): Promise<void> {
    return this.loadedFilesService.uploadHenData(
      body.results.data,
      body.fileName,
    );
  }

  @Post('uploadsahdata')
  async uploadSahData(@Body() body) {
    return this.loadedFilesService.uploadSahData(
      body.results.data,
      body.fileName,
    );
  }

  @Post('uploadoption5data')
  async uploadOption5Data(@Body() body) {
    return this.loadedFilesService.uploadOption5Data(
      body.results.data,
      body.fileName,
      body.branchId,
    );
  }

  @Post('updateclinicbilling')
  async uploadUpdatedClinicBillingData(@Body() body) {
    console.log(body);
    return this.loadedFilesService.uploadUpdatedClinicBillingData(
      body.data,
      body.fileName,
      body.branchId,
    );
  }

  @Post('deletefile')
  async deleteFile(@Body() body) {
    return this.loadedFilesService.deleteFile(body.fileName);
  }

  // print
  @Post('getprintdata')
  async getPrintData(@Body() body) {
    console.log('print data--->', body.date.split('-').join(''));
    return this.printService.getPrintData(
      body.clinicCode,
      body.date.split('-').join(''),
      body.printType,
    );
  }

  // fixed values
  @Post('fixedvalues/uploadcsvdata')
  uploadFIxedValueData(@Body() body) {
    return this.loadedFilesService.uploadFIxedValueData(
      body.results.data,
      body.fileName,
      body.accountId,
    );
  }

  @Post('fixedvalues/search')
  searchFixedValue(@Body() body) {
    return this.loadedFilesService.searchFixedValue(
      body.account_id,
      body.startDate,
      body.endDate,
    );
  }
  @Post('deleteByIdFixedValue')
  deleteById(@Body() body) {
    return this.loadedFilesService.deleteById(body);
  }
}
