import Axios from "axios";
import Qs from "querystring";
import Tools from "../tools/Tools";

class Command {
	async now() {
		return await Axios.post(`/time/time/now`);
	}
}

export default new Command();
