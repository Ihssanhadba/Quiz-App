export interface Question {
    id:number;
    category: string ;
    question: string;
    answers: string[];
    correctAnswersIndex: number;
}
export interface Questions {
    questions: Question[];
}