<template>
	<body>

		<form novalidate class="md-layout">
			<md-card class="form md-layout-item md-size-50 md-small-size-100">
				<md-card-header>
					<div class="md-title">Settings</div>
				</md-card-header>
				<md-card-content>
					<div class="md-layout md-gutter">
						<div class="md-layout-item md-small-size-100">
							<md-field>
								<label>Your IMCO domain*:</label>
								<md-input
									name="text"
									v-model="domain">
								</md-input>
							</md-field>
						</div>
					</div>
				</md-card-content>
			</md-card>
		</form>
	</body>
</template>

<script>

	import Vue from 'vue';
	import { MdField, MdCard } from 'vue-material/dist/components';
	import 'vue-material/dist/vue-material.min.css';
	import 'vue-material/dist/theme/default.css';
	Vue.use(MdField);
	Vue.use(MdCard);

	export default {
		data() {
			return {
				domain: '',
			}
		},
		watch: {
			domain(domain) {
				chrome.storage.local.set({ domain });
			},
		},
	}
</script>

<style>
	.form {
		margin: 40px auto 0;
	}
</style>
