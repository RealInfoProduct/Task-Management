import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { companyList, EmaployeeList, ProjectList, ProjectRoleList, TechnologyList } from '../interface/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private fService: Firestore
  ) { }

  userId() : string {
    let userId : any= '';
    userId = localStorage.getItem('companyId');
    return userId
  }
  
  addCompanyData(data: companyList) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'CompanyList'), data)
  }

  getAllCompanyList() {
    let dataRef = collection(this.fService, `CompanyList`)
    return collectionData(dataRef, { idField: 'id' })
  }

  updateCompanyData(data: companyList, CompanyList: any) {
    let dataRef = doc(this.fService, `CompanyList/${data}`);
    return updateDoc(dataRef, CompanyList)
  }


  // TechnologyList

  addTechnologyList(data: TechnologyList) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'TechnologyList'), data)
  }

  getTechnologyList() {
    let dataRef = collection(this.fService, `TechnologyList`)
    return collectionData(dataRef, { idField: 'id' })
  }

  deleteTechnologyList(data: TechnologyList) {
    let docRef = doc(collection(this.fService, `TechnologyList`), data.id);
    return deleteDoc(docRef)
  }

  updateTechnologyList(data: TechnologyList, TechnologyList: any) {
    let dataRef = doc(this.fService, `TechnologyList/${data}`);
    return updateDoc(dataRef, TechnologyList)
  }

  // ProjectList

  addProjectList(data: ProjectList) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'ProjectList'), data)
  }

  getProjectList() {
    let dataRef = collection(this.fService, `ProjectList`)
    return collectionData(dataRef, { idField: 'id' })
  }

  deleteProjectList(data: ProjectList) {
    let docRef = doc(collection(this.fService, `ProjectList`), data.id);
    return deleteDoc(docRef)
  }

  updateProjectList(data: ProjectList, ProjectList: any) {
    let dataRef = doc(this.fService, `ProjectList/${data}`);
    return updateDoc(dataRef, ProjectList)
  }
  
  // EmaployeeList

  addEmaployeeList(data: EmaployeeList) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'EmaployeeList'), data)
  }

  getEmaployeeList() {
    let dataRef = collection(this.fService, `EmaployeeList`)
    return collectionData(dataRef, { idField: 'id' })
  }

  deleteEmaployeeList(data: EmaployeeList) {
    let docRef = doc(collection(this.fService, `EmaployeeList`), data.id);
    return deleteDoc(docRef)
  }

  updateEmaployeeList(data: EmaployeeList, EmaployeeList: any) {
    let dataRef = doc(this.fService, `EmaployeeList/${data}`);
    return updateDoc(dataRef, EmaployeeList)
  }

  // TechnologyList

  addProjectRoleList(data: ProjectRoleList) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'ProjectRoleList'), data)
  }

  getProjectRoleList() {
    let dataRef = collection(this.fService, `ProjectRoleList`)
    return collectionData(dataRef, { idField: 'id' })
  }

  deleteProjectRoleList(data: ProjectRoleList) {
    let docRef = doc(collection(this.fService, `ProjectRoleList`), data.id);
    return deleteDoc(docRef)
  }

  updateProjectRoleList(data: ProjectRoleList, ProjectRoleList: any) {
    let dataRef = doc(this.fService, `ProjectRoleList/${data}`);
    return updateDoc(dataRef, ProjectRoleList)
  }
  
}
