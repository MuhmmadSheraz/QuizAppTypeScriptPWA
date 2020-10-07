import { RawQuestions, FilteredQuestions } from '../Types/quizQuestionTYpes'
const shuffleArray = (array: any[]) =>
    [...array].sort(() => Math.random() - 0.5)
export const getQuestions = async (totalQuestions: number, level: string): Promise<FilteredQuestions[]> => {

    console.log("total Questions ", totalQuestions)
    const res = await fetch("https://opentdb.com/api.php?amount=5&category=10&difficulty=easy&type=multiple")
    let { results } = await res.json()
    const quizArray: FilteredQuestions[] = results.map((x: RawQuestions) => {
        return {
            question: x.question,
            options: shuffleArray(x.incorrect_answers.concat(x.correct_answer)),
            correct_answer: x.correct_answer
        }
    })
    return quizArray
} 