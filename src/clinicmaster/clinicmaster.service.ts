import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';

@Injectable()
export class ClinicmasterService {
  constructor(
    @InjectRepository(ClinicMaster)
    private readonly clinicMasterRepository: Repository<ClinicMaster>,
  ) {}
  async getAllClinics() {
    return this.clinicMasterRepository.find();
  }

  async insertNewClinic(clinicInfo) {
    try {
      const clinicMaster = new ClinicMaster();
      clinicMaster.clinic_code = clinicInfo.clinic_code;
      clinicMaster.clinic_name = clinicInfo.clinic_name;
      clinicMaster.clinic_kana = clinicInfo.clinic_kana;
      clinicMaster.contract_type = clinicInfo.contract_type;
      clinicMaster.address_1 = clinicInfo.address_1;
      clinicMaster.postal_code = clinicInfo.postal_code;
      clinicMaster.created_at = new Date();
      await this.clinicMasterRepository.save(clinicMaster);
    } catch (error) {
      console.log(error);
    }
  }

  async SearchClinicName(body) {
    if (body.clinic_code === '') {
      const clinicName = await this.clinicMasterRepository.find({
        where: { clinic_kana: body.clinic_kana },
      });
      return clinicName;
    } else if (body.clinic_kana === '') {
      const clinicName = await this.clinicMasterRepository.find({
        where: { clinic_code: body.clinic_code },
      });
      return clinicName;
    } else {
      const clinicName = await this.clinicMasterRepository.find({
        where: { clinic_kana: body.clinic_kana, clinic_code: body.clinic_code },
      });
      return clinicName;
    }
  }
  async deleteItem(body) {
    const data = await this.clinicMasterRepository.remove(body);
  }

  async updateItem(body) {
    try {
      const clinicMaster = new ClinicMaster();
      clinicMaster.id = body.id;
      clinicMaster.clinic_code = body.clinic_code;
      clinicMaster.clinic_name = body.clinic_name;
      clinicMaster.clinic_kana = body.clinic_kana;
      clinicMaster.contract_type = body.contract_type;
      clinicMaster.address_1 = body.address_1;
      clinicMaster.postal_code = body.postal_code;
      clinicMaster.updated_at = new Date();
      await this.clinicMasterRepository.save(clinicMaster);
    } catch (error) {
      console.log(error);
    }
  }
  async getOneClinic(clinic_code) {
    const row = await this.clinicMasterRepository.findOne({
      where: { clinic_code: clinic_code },
    });
    console.log(row);
    return row ? row.clinic_name : null;
  }
}
