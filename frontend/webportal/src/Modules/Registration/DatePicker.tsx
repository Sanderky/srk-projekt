import React from 'react';

import { format } from 'date-fns';
import { DayPicker, Row, RowProps, DayOfWeek, ClassNames, SelectSingleEventHandler } from 'react-day-picker';
import { differenceInCalendarDays } from 'date-fns';
import pl from 'date-fns/locale/pl';
import 'react-day-picker/dist/style.css';
import './DatePicker.css';
import { formatWithOptions } from 'util';


function isPastDate(date: Date) {
    return differenceInCalendarDays(date, new Date()) < 0;
}

function OnlyFutureRow(props: RowProps) {
    const isPastRow = props.dates.every(isPastDate);
    if (isPastRow) return <></>;
    return <Row {...props} />;
}

export default function DatePicker(props: { selected: Date | undefined; setSelected: SelectSingleEventHandler; }) {


    let footer = <p>Wybierz dzień.</p>;
    if (props.selected) {
        footer = <p>Wybrano: {format(props.selected, 'EEEE, dd-MM-yyyy', { locale: pl })}</p>;
    }
    const currentMonth = new Date();
    const maxMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 3)

    const dayOfWeekMatcher: DayOfWeek = {
        dayOfWeek: [0, 6]
    };

    return (
        <DayPicker
            fromDate={new Date()}
            mode="single"
            selected={props.selected}
            components={{ Row: OnlyFutureRow }}
            onSelect={props.setSelected}
            footer={footer}
            hidden={isPastDate}
            showOutsideDays
            locale={pl}
            disabled={dayOfWeekMatcher}
            fromMonth={currentMonth}
            toMonth={maxMonth}
        />
    );
}