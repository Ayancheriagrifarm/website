// Check If Device Is Mobile Or Not

const isMobile =
	/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
		navigator.userAgent
	) ||
	/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
		navigator.userAgent.substr(0, 4)
	);

let skip, limit;
// let loading = false;
let finished = false;
let onProgress = false;
const search = getUrlVars()['search'] || '';

if (isMobile) {
	skip = 2;
	limit = 4;
} else {
	skip = 0;
	limit = 6;
	first = 1;
}

// Function For Load

const loadMore = () => {
	if (onProgress) return;
	skip += limit;
	if (!isMobile && first === 1) limit = 12;
	// 	listAllCards(false);
	// };

	// const listAllCards = (reset = true) => {
	// loading = true;
	// if (reset) {
	// 	skip = 0;
	// 	finished = false;
	// }
	$.ajax({
		type: 'GET',
		url: `${
			window.location.href.split('?')[0]
		}?search=${search}&skip=${skip}&limit=${limit}`,
		headers: {
			Accept: 'application/json; charset=utf-8',
		},
		success: (result) => {
			result.data.forEach((card) => {
				$('#cards').append(
					$('<div/>', {
						class: 'col-6 col-sm-4 col-md-3 col-lg-2 mb-4',
					}).html(
						`<div class="card shadow" style= "cursor:pointer"
						  onclick= "location.href='${window.location.href.split('?')[0]}/${card._id}'">
							<img class="card-img-top card-img-cover" src="${card.image}" alt="${card.title}" />
							<div class="card-card">
								<h5 class="card-title my-1">${card.title}</h5>
								<p class="card-text mb-1 px-3 desc">${card.description || '...'}</p>
								<h6 class="card-text mb-1"> ₹${card.price || 0}</h6>
								<h6 class="mb-0 ${card.inStock ? 'text-success' : 'text-danger'}">
									${card.inStock ? 'Available' : 'Sold Out'}
								</h6>
								${
									result.isLoggedIn
										? `<div style="display: flex; justify-content: flex-end">
										<form action="${window.location.href}/${card._id}/instock" method="post">
											<button
												class="p-0 mr-2 edit"
												style="border: none; background-color: transparent"
											>
											<i
											class="fas ${card.inStock ? 'fa-eye-slash fa-flip-horizontal' : 'fa-eye'}"
										></i>
											</button>
										</form>
										<a class="mr-1 edit" href="${window.location.href}/${card._id}/edit">
											<i class="fas fa-pencil"></i
										></a></div>`
										: '<div class="py-1"></div>'
								}
							</div>
						</div>`
					)
				);
			});
			if (!isMobile && first === 1) {
				skip += 6;
				limit = 6;
				first = 0;
			}
			if (!result.meta.has_more) {
				finished = true;
				// loadMoreElement.style.visibility = 'hidden';
			}
			// else {
			// loadMoreElement.style.visibility = 'visible';
			// }
			// loading = false;
			onProgress = false;
		},
		error: (data) => alert(data.error),
	});
	onProgress = true;
};

// Load If Page Not Filled

$(window).on('load', () => {
	if ($(window).height() >= $(document).height() && !onProgress && !finished) loadMore();
});

// Load On Scroll

document.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	if (!finished && !onProgress && clientHeight + scrollTop >= scrollHeight - 5)
		loadMore();
});

// Function For Getting Search Parameter From URL

function getUrlVars() {
	let hash;
	const vars = [];
	const hashes = window.location.href
		.slice(window.location.href.indexOf('?') + 1)
		.split('&');
	for (let i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
