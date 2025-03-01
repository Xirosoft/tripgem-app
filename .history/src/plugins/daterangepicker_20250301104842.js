import 'daterangepicker'
import 'daterangepicker/daterangepicker.css'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import $ from 'jquery'

dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

window.moment = dayjs // Make dayjs available as moment

$.fn.daterangepicker.defaultOptions = {
  locale: {
    format: 'MM/DD/YYYY',
  },
  autoUpdateInput: false,
  opens: 'left',
  ranges: {
    Today: [dayjs(), dayjs()],
    Yesterday: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
}
