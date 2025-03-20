import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enUS from 'date-fns/locale/en-US';

// Create a custom adapter extending AdapterDateFns
// This is a workaround for the date-fns import issue
class CustomDateAdapter extends AdapterDateFns {
    constructor() {
        super({ locale: enUS });
    }
}

export default CustomDateAdapter; 