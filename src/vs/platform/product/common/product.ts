/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProductConfiguration } from 'vs/platform/product/common/productService';
import { isWeb } from 'vs/base/common/platform';
import { env } from 'vs/base/common/process';
import { FileAccess } from 'vs/base/common/network';
import { dirname, joinPath } from 'vs/base/common/resources';

let product: IProductConfiguration;

// Web or Native (sandbox TODO@sandbox need to add all properties of product.json)
if (isWeb || typeof require === 'undefined' || typeof require.__$__nodeRequire !== 'function') {

	// Built time configuration (do NOT modify)
	product = { /*BUILD->INSERT_PRODUCT_CONFIGURATION*/ } as IProductConfiguration;

	// Running out of sources
	if (Object.keys(product).length === 0) {
		Object.assign(product, {
			version: '1.53.0-dev',
			nameShort: isWeb ? 'Vydrach Web' : 'Vydrach',
			nameLong: isWeb ? 'Vydrach Web' : 'Vydrach',
			applicationName: 'vydrach',
			dataFolderName: '.vydrach',
			urlProtocol: 'vydrach',
			reportIssueUrl: 'https://github.com/val-verde/vydrach/issues/new',
			licenseName: 'MIT',
			licenseUrl: 'https://github.com/val-verde/vydrach/blob/val-verde-mainline/LICENSE.txt',
			extensionAllowedProposedApi: [
				'ms-vscode.vscode-js-profile-flame',
				'ms-vscode.vscode-js-profile-table',
				'ms-vscode.github-browser'
			],
		});
	}
}

// Native (non-sandboxed)
else {

	// Obtain values from product.json and package.json
	const rootPath = dirname(FileAccess.asFileUri('', require));

	product = require.__$__nodeRequire(joinPath(rootPath, 'product.json').fsPath);
	const pkg = require.__$__nodeRequire(joinPath(rootPath, 'package.json').fsPath) as { version: string; };

	// Running out of sources
	if (env['VSCODE_DEV']) {
		Object.assign(product, {
			nameShort: `${product.nameShort} Dev`,
			nameLong: `${product.nameLong} Dev`,
			dataFolderName: `${product.dataFolderName}-dev`
		});
	}

	Object.assign(product, {
		version: pkg.version
	});
}

export default product;
