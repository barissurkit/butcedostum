//buaradaki amacım: transaction verisi UI içinde dolaşırken hatasız olsun.
 
export type Transaction = { //transaction adında bir Typescript tanımladım.
  id: string; // her kaydın benzersiz kimliği
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string | null;
  createdAt: string; // kaydın oluşturulma zamanı için.
};
