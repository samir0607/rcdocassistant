import { ISetting, SettingType } from "@rocket.chat/apps-engine/definition/settings";

export const settings: ISetting[] = [
	{
		id: "model",
		i18nLabel: "Model",
		i18nDescription: "Select model to use",
		type: SettingType.SELECT,
		values: [
			{key: "llama3-70b", i18nLabel: "Llama3 70b"},
			{key: "mistral-7b", i18nLabel: "Mistral 7b"}
		],
		required: true,
		public: true,
		packageValue: "llama3-70b",
	},
]