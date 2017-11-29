import { Injectable } from '@angular/core';

@Injectable()
export class LogService {
    messages: string[] = [];

    add(message: string) {
        this.messages.push(message);
    }

    clear() {
        this.messages = [];
    }
}