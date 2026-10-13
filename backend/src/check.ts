import GetFiscalYear from "get-fiscal-year";
import dayjs from 'dayjs'
const get = async () => {
    const getFinacialYear = new GetFiscalYear();
    const [Years] = await Promise.all([
        getFinacialYear.getFiscalYear("IN", "current")
    ]);
     const current = dayjs(Years.fiscalYearStart.split('T')[0]).format('YY')
     const next = dayjs(Years.fiscalYearEnd.split('T')[0]).format('YY')

     console.log(current, next)
};
get()