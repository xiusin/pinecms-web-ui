import { BaseService, Service } from "/@/cool";

@Service("district")
class SysDistrict extends BaseService {

	import() {
		return this.request({
			url: "/import",
			method: "POST"
		});
	}
}

export default SysDistrict;
