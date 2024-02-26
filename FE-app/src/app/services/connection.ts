import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from './response';
import { result } from '../models/result'
@Injectable({
    providedIn: 'root',
})
export class ConnectionService{
    private api = "http://localhost:3000";
    constructor(private http: HttpClient){
    }
    public getWords(){
        return this.http.get<Response>(this.api+'/getWordSet')     
    } 
    public addResult(result:result){
        
        return this.http.post<Response>(this.api + '/addResult ',result)
    } 
    public getResults(){
        return this.http.get<Response>(this.api+'/getResults')     
    }      
}