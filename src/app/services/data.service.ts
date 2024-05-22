  // data.service.ts
  import { Injectable } from '@angular/core';
  import { Task } from '../model/task.model'
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { catchError, map, Observable, throwError } from 'rxjs';
  import { BehaviorSubject } from 'rxjs';



  @Injectable({
    providedIn: 'root',
  })
  export class DataService {
    loadSubcategories(arg0: string) {
      throw new Error('Method not implemented.');
    }

    private apiUrl = 'https://maraton.builtwithdark.com';

    constructor(private http: HttpClient) { }

      private selectedTaskSubject = new BehaviorSubject<Task | null>(null);
      public selectedTask$ = this.selectedTaskSubject.asObservable();

      private performerDataSubject = new BehaviorSubject<{ name: string, login: string, password: string } | null>(null);
      performerData$ = this.performerDataSubject.asObservable();

      private clientDataSubject = new BehaviorSubject<{name: string, login: string, password: string } | null>(null);
      clientData$ = this.clientDataSubject.asObservable();

      private selectedSubcategorySubject = new BehaviorSubject<any | null>(null);
      public selectedSubcategory$ = this.selectedSubcategorySubject.asObservable();

      public clientAccessKey: string = '';
      public performerAccessKey: string = '';

      private selectedSubcategory: any | null = null;

      private selectedTermSource = new BehaviorSubject<string | null>(null);

      private selectedTermSubject = new BehaviorSubject<string | null>(null);
      selectedTerm$ = this.selectedTermSource.asObservable();

      private selectedTypeSubject = new BehaviorSubject<string | null>(null);
      selectedType$ = this.selectedTypeSubject.asObservable();

      private taskId: string | null = null;

        setSelectedType(type: string) {
          this.selectedTypeSubject.next(type);
        }

        setSelectedTerm(term: string) {
          this.selectedTermSubject.next(term);
        }

        setSelectedSubcategory(subcategory: any) {
          this.selectedSubcategory = subcategory;
        }

        getSelectedSubcategory(): any | null {
          return this.selectedSubcategory;
        }

        adminEnter(token: string) {
          return this.http.get(`${this.apiUrl}/admin/enter?token=${token}`)
        }

        registerClient(data: {name: string, login: string, password: string }): Observable<any> {
          console.log('Данные перед отправкой:', data);
          return this.http.post(`${this.apiUrl}/regClient`, data);
        }

        loginClient(data: {name: string, login: string, password: string }): Observable<any> {
          return this.http.post(`${this.apiUrl}/loginClient`, data);
        }
        
        setPerformerData(data: { name: string, login: string, password: string }) {
          this.performerDataSubject.next(data);
        } 

        setClientData(data: { name: string, login: string, password: string }) {
          this.clientDataSubject.next(data);
        } 

        registerPerformer(data: {name: string, login: string, password: string }): Observable<any> {
          console.log('Данные перед отправкой:', data);
          return this.http.post(`${this.apiUrl}/regPerformer`, data);
        }

        loginPerformer(data: {name: string, login: string, password: string }): Observable<any> {
          console.log('Данные перед отправкой:', data);
          return this.http.post(`${this.apiUrl}/loginPerformer`, data);
        }

        getCategories(): Observable<any[]> {
          return this.http.get<any[]>(`${this.apiUrl}/categories`);
        }

        createCategory(body: {data: {name: string, description: string, image: string}, token: string}): Observable<string> {
          return this.http.post<string>(`${this.apiUrl}/category`, body);
        }

        createSubcategory(body: {data: {name: string, description: string, image: string, category: string}, token: string}): Observable<string> {
          return this.http.post<string>(`${this.apiUrl}/subcategory`, body);
        }

        deleteCategory(adminToken: string, categoryId: string): Observable<any> {
          return this.http.delete<any>(`${this.apiUrl}/category`, {
            body: {
              token: adminToken,
              id: categoryId
            }
          });
        }

        deleteSubcategory(adminToken: string, subcategoryId: string): Observable<any> {
          return this.http.delete<any>(`${this.apiUrl}/subcategory`, {
            body: {
              token: adminToken,
              id: subcategoryId
            }
          });
        }
      
        getSubcategories(categoryId: string): Observable<any[]> {
          return this.http.get<any[]>(`${this.apiUrl}/category?id=${categoryId}`);
        }

        setSelectedTask(task: Task) {
          this.selectedTaskSubject.next(task);
        }
      
        getSelectedTask(): Observable<Task | null> {
          return this.selectedTask$;
        }

        setClientAccessKey(key: string): void {
          localStorage.setItem("acckey", key);
          console.log('Установлен токен:', key);
        }

        getClientAccessKey(): string {
          return localStorage.getItem("acckey") ?? "";
        }

        setPerformerAccessKey(accessKey: string): void {
          // this.performerAccessKey = accessKey;
          localStorage.setItem("acckey", accessKey);
          console.log('Установлен токен:', accessKey);
        }

        setSelfId(id: string): void {
          
        }

        setTaskId(taskId: string): void {
          this.taskId = taskId;
          console.log('Установлен id задачи:', taskId);
        }
      
        getTaskId(): string | null {
          return this.taskId;
        }
        
        getPerformerAccessKey(): string {
          // const key = this.performerAccessKey;
          // if (!key) {
          //   console.error('Токен авторизованного пользователя отсутствует.');
          // }
          // console.log('Токен авторизованного пользователя:', key);
          // return key;
          return localStorage.getItem("acckey") ?? "";
        }      
        
        saveTaskToDatabase(task: Task): Observable<Task> {
          const authToken = this.getClientAccessKey();
          const headers = new HttpHeaders().set('Authorization', authToken);
          const options = { headers: headers };
          console.log('отправляем:', task);
          return this.http.post<Task>(`${this.apiUrl}/task`, task, options);
        }

        getTask(id: string): Observable<any> {
          return this.http.get<any>(`${this.apiUrl}/task/byid?taskId=${id}`);
        }

        getTasks(): Observable<any[]> {
          return this.http.get<any[]>(`${this.apiUrl}/freeTasks`);
        }

        getClientInfo(clientId: string): Observable<any> {
          return this.http.get<any>(`${this.apiUrl}/client?id=${clientId}`);
        }

        validateClient(accKey: string): Observable<any> {
          return this.http.get(`${this.apiUrl}/valClient?accKey=${accKey}`);
        }

        validatePerformer(accKey: string): Observable<any> {
          return this.http.get(`${this.apiUrl}/valPerformer?accKey=${accKey}`);
        }

        respondToTask(taskId: string): Observable<any> {
          const authToken = this.getPerformerAccessKey();
        
          const headers = new HttpHeaders().set('Authorization', authToken);
          const options = { headers: headers };
          const requestBody = { "taskId": taskId };
        
          return this.http.post<any>(`${this.apiUrl}/performer/task`, requestBody, options);
        }
        
        getCandidates(taskId: string): Observable<any> {
          const authToken = this.getClientAccessKey();

          const headers = new HttpHeaders().set('Authorization', authToken);
          const options = { headers: headers };
          
          return this.http.get(`${this.apiUrl}/task/candidates?taskId=${taskId}`, options);
        }

        getPerformerById(performerId: string): Observable<any> {
          return this.http.get<any>(`${this.apiUrl}/performer/byid?id=${performerId}`);
        }

        getPerformerTasks(): Observable<any[]> {
          const authToken = this.getPerformerAccessKey();
        
          const headers = new HttpHeaders().set('Authorization', authToken);
          const options = { headers: headers };
          
          return this.http.get<any[]>(`${this.apiUrl}/performer/tasks`, options);
        }

        choosePerformer(performerId: string, taskId: string): Observable<any> {
          const authToken = this.getClientAccessKey();

          const headers = new HttpHeaders().set('Authorization', authToken);
          const options = { headers: headers };

          const body = {
            choosen: performerId,
            taskId: taskId
          };

          return this.http.post<any>(`${this.apiUrl}/client/choose`, body, options);
        }

        // sendMessage(role: string, taskId: string, message: string): Observable<any> {
        //   const accKey = role === 'client' ? this.getClientAccessKey() : this.getPerformerAccessKey();
        //   const headers = new HttpHeaders().set('Authorization', accKey);
        //   const options = { headers: headers };

        //   const body = {
        //     message: message,
        //     taskId: taskId
        //   };
        //   console.log(accKey);
        //   return this.http.post(`/chat?role=${role}`, body, options);
        // }

        sendMessage(role: string, message: string, taskId: string): Observable<any> {
          const accKey = role === 'client' ? this.getClientAccessKey() : this.getPerformerAccessKey();
          const headers = new HttpHeaders()
            .set('Authorization', accKey);
          const options = { headers: headers };
        
          const body = {
            role: role,
            message: message,
            taskId: taskId
          };
          console.log(accKey);
          return this.http.post(`${this.apiUrl}/chatsend`, body, options);
        }

        getMessages(role: string, taskId: string): Observable<any[]> {
          const accKey = role === 'client' ? this.getClientAccessKey() : this.getPerformerAccessKey();
          const headers = new HttpHeaders().set('Authorization', accKey);
          const options = { headers: headers };
          return this.http.get<any[]>(`${this.apiUrl}/chat?role=${role}&taskId=${taskId}`, options);
        }

        endChat(taskId: string, message: string): Observable<any> {
          const accKey = this.getPerformerAccessKey();
          const headers = new HttpHeaders().set('Authorization', accKey);
          const options = { headers: headers };
          const body = {
            message: message,
            taskId: taskId
          };
          console.log(taskId);
          console.log(accKey);
          return this.http.post(`${this.apiUrl}/chatanswer`, body, options);
        }
      }
