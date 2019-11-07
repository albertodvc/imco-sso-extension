<template>
	<body>
		<h1>IMCO Login</h1>
		<div class="configure" v-if="!domain">
			<a v-on:click="configure" href="#">Please configure the extension first</a>
		</div>
		<div class="error" v-if="error">
			<span>{{ error }}</span>
		</div>
		<div class="loading"
			v-show="domain && !customers && !error">
			<bounce-loader
				:size="'50px'"
				:color="'#3d76aa'">
			</bounce-loader>
		</div>
		<ul class="customers" v-if="customers">
			<li class="customer"
				v-for="customer in customers"
				v-bind:key="customer.id"
				v-on:click="activeCustomer = (activeCustomer === customer.id) ? null : customer.id"
				v-bind:class="{ active: customers.length == 1 || activeCustomer == customer.id }">
				<h2 class="customer__name">{{ customer.name }}</h2>
				<ul class="users">
					<li class="user"
						v-for="user in customer.users"
						v-bind:key="user.id">
						<span class="user__name">{{ user.email }}</span>
						<button class="user__login-button"
							type=button
							v-on:click="login(user.id)">
							Login
						</button>
					</li>
				</ul>
			</li>
		</ul>
	</body>
</template>

<script>

	import axios from 'axios';
	import BounceLoader from 'vue-spinner/src/BounceLoader.vue';

	export default {
		components: {
			BounceLoader,
		},
		data() {
			return {
				message: 'POPOVER',
				customers: null,
				error: null,
				activeCustomer: null,
				domain: null,
			}
		},
		created() {
			chrome.storage.local.get('domain', (result) => {
				if (result.domain) {
					this.domain = result.domain;
					axios.get(`https://clients.${this.domain}:886/v1/admin/customers`)
						.then(({ data: customers }) => {
							return Promise.all(
								customers.map(({ id: customerID }) =>
									axios.get(`https://clients.${this.domain}:886/v1/admin/customers/${customerID}/users`)
										.then(({ data }) => data)
								)
							).then(users => customers.map((customer, idx) => ({
								...customer,
								users: users[idx]
							})))
						}).then(customers => this.customers = customers)
						.catch((res) => this.error = (res.response && res.response.error) ? res.response.error : res);
				}

			});

		},
		methods: {
			login(userID) {
				console.log('login', userID);
				axios.post(`https://clients.${this.domain}:886//v2/admin/users/${userID}/sso_tokens`)
					.then(({ data: sso }) => chrome.tabs.update({ url: `https://start.${this.domain}/users/sso?token=${sso.token}` }))
			},
			configure() {
				chrome.tabs.create({'url': "/options.html" } )
			}
		}
	}
</script>

<style>

	body {
		padding: 0;
		margin: 0;
		color: #585858;
	}

	h1,
	h2 {
		margin: 0;
		white-space: nowrap;
	}

	h1 {
		padding: 20px 45px 20px 10px;
		background-image: url('./background.png');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		color: white;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.customer__name {
		padding: 10px 15px;
		cursor: pointer;
	}

	.users {
		overflow: hidden;
		max-height: 0;
		transition: all 0.3s ease-in-out;
	}

	.customer.active .users {
		max-height: 1000px;
		transition: all 0.3s ease-in-out;
	}

	.user {
		padding: 10px 15px;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid #dedede;
	}

	.user__name,
	.user__login-button {
		display: inline-block;
	}

	.user__login-button {
		border: none;
		margin: 0;
		padding: 0;
		width: auto;
		overflow: visible;
		background: transparent;
		color: inherit;
		font: inherit;
		line-height: normal;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;
		-webkit-appearance: none;
		background: #3d76aa;
		color: white;
		padding: 8px 20px;
		border-radius: 3px;
		margin-left: 20px;
		cursor: pointer;
	}

	&::-moz-focus-inner {
		border: 0;
		padding: 0;
	}

	.configure,
	.error,
	.loading {
		padding: 30px 20px;
		white-space: nowrap;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	a {
		color: #3d76aa;
	}

	.error {
		color: #cd3f34;
		font-weight: 800;
	}

</style>
