Vue.component("lever-jobs", {
	template: '<div id="lever-jobs-container"><div class="jobs-teams" v-show="showFilter"><a href="javascript://" class="btn" v-for="(teams, dname) in departments" @click="toggleFilterByDeptName(dname)" v-bind:class="{ active: filterByDeptName == dname }">{{dname}}</a></div><div><section class="lever-department" v-for="(teams, dname) in departments"><div v-show="filterByDeptName == null || filterByDeptName == dname"><h3 class="lever-department-title">{{dname}}</h3><ul class="lever-team" v-for="(jobs, tname) in teams"><li><h4 class="lever-team-title">{{tname}}</h4><ul><li class="lever-job" v-for="posting in jobs"><a class="lever-job-title" :href="posting.hostedUrl">{{posting.text}}</a><span class="lever-job-tag">{{posting.categories.location}}</span></li></ul></li></ul></div></section></div></div>',
	props: {
		showFilter: {
			type: Boolean,
			default: true
		},
		dept: {
			type: Array,
			default: null
		}
	},
	data: function() {
		return {
			jobs: [],
			filterByDeptName: null
		};
	},
	mounted: function() {
		var self = this;
		jQuery.ajax({
			dataType: "json",
			url: 'https://api.lever.co/v0/postings/entangledtalent?mode=json',
			success: function(data){
				data.sort((a, b) => {
					var key1 = a.categories.department + '-' + a.categories.team + '-' + a.text;
					var key2 = b.categories.department + '-' + b.categories.team + '-' + b.text;
					if (key1 > key2) return 1;
					if (key2 > key1) return -1;
					return 0;
				});
				self.jobs = data;
			}
		});
	},
	computed: {
		departments: function() {
			var self = this;
			var retValue = {};	
			jQuery.each(self.jobs, function(index, job){
					if (!self.dept || self.dept.length == 0 || self.dept.indexOf(job.categories.department) > -1) {
					if (!retValue[job.categories.department]) {
						retValue[job.categories.department] = {};
					}
					if (!retValue[job.categories.department][job.categories.team]) {
						retValue[job.categories.department][job.categories.team] = [];
					}
					retValue[job.categories.department][job.categories.team].push(job);
				}
			});
			return retValue;
		}
	},
	methods: {
		toggleFilterByDeptName: function(name) {
			if (this.filterByDeptName == name) {
				this.filterByDeptName = null;
			}
			else {
				this.filterByDeptName = name;
			}
		}
	}
});

var app = new Vue({
	el: "#app"
});

