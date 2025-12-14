import type { Transaction, TransactionType } from "@/types/transaction";


function formatMoney(amount:number) {
    return `${amount.toLocaleString("tr-TR")} ₺`;
}

function sumByType(transactions:Transaction[], type: TransactionType) { // DRY DÜŞÜNCESİ
    return transactions
        .filter((t) => t.type === type)
        .reduce((sum,t) => sum +t.amount, 0);
}

export default function SummarySection(props: {transactions: Transaction[]}) {
    const totalIncome = sumByType(props.transactions, "income");
    const totalExpense = sumByType(props.transactions, "expense");
    const balance = totalIncome -  totalExpense;

    return(
        <section>
            <h2>Özet</h2>

            <ul>
                <li>Toplam Gelir: {formatMoney(totalIncome)}</li>
                <li>Toplam Gider: {formatMoney(totalExpense)}</li>
                <li>Bakiye: {formatMoney(balance)}</li>
            </ul>
        </section>
    );
}