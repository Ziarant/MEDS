// 导入材料信息
const username = localStorage.getItem('username')
const materialData = getMaterials(username)
let matData;
let maxModulus = -1, maxPoisson = -1, maxYield = -1, maxG = -1, maxA = -1, maxZ = -1;
let maxTensile = -1, maxCompress = -1, maxBending = -1, maxShearing = -1, maxFatigued = -1;
let maxHR = -1, maxHBW = -1, maxHV = -1, maxKic = -1, maxAk = -1;
materialData.then(data => {
    matData = data
    const materials = Object.keys(matData)
    // 材料选择列表
    const materialList = document.getElementById('material-list')
    // 提取所有材料的最大值，如无值，设置为-1
    materials.forEach(mat => {
        // 将材料名称添加到页面
        let material = matData[mat]
        const matLi = document.createElement('li')
        matLi.textContent = `${material.type}-${mat}`
        matLi.className = 'material-item p-2 rounded';
        let propIndex = 0;
        material.properties.forEach(prop => {
            const propLi = document.createElement('li')
            propLi.className = 'prop-item p-1 rounded hover:bg-secondary hover:text-primary cursor-pointer ml-4'
            propLi.textContent = `${prop.status}`
            propLi.setAttribute('data-material', mat)
            propLi.setAttribute('data-property', propIndex)
            if(prop.title) {propLi.title = prop.title}
            matLi.appendChild(propLi)
            // 更新最大值
            if(prop.modulus) { maxModulus = prop.modulus[1] > maxModulus? prop.modulus[1] : maxModulus; };
            if(prop.poisson) { maxPoisson = prop.poisson[1] > maxPoisson? prop.poisson[1] : maxPoisson; };
            if(prop.yield) { maxYield = prop.yield[1] > maxYield? prop.yield[1] : maxYield; };
            if(prop.G) {maxG = prop.G[1] > maxG? prop.G[1] : maxG; };
            if(prop.A) {maxA = prop.A[1] > maxA? prop.A[1] : maxA; };
            if(prop.Z) {maxZ = prop.Z[1] > maxZ? prop.Z[1] : maxZ; };
            if(prop.tensile) {maxTensile = prop.tensile[1] > maxTensile? prop.tensile[1] : maxTensile; };
            if(prop.compress) {maxCompress = prop.compress[1] > maxCompress? prop.compress[1] : maxCompress; };
            if(prop.bending) {maxBending = prop.bending[1] > maxBending? prop.bending[1] : maxBending; };
            if(prop.shearing) {maxShearing = prop.shearing[1] > maxShearing? prop.shearing[1] : maxShearing; };
            if(prop.fatigued) {maxFatigued = prop.fatigued[1] > maxFatigued? prop.fatigued[1] : maxFatigued; };
            if(prop.HR) {maxHR = prop.HR[1] > maxHR? prop.HR[1] : maxHR; };
            if(prop.HBW) {maxHBW = prop.HBW[1] > maxHBW? prop.HBW[1] : maxHBW; };
            if(prop.HV) {maxHV = prop.HV[1] > maxHV? prop.HV[1] : maxHV; };
            if(prop.Kic) {maxKic = prop.Kic[1] > maxKic? prop.Kic[1] : maxKic; };
            if(prop.Ak) {maxAk = prop.Ak[1] > maxAk? prop.Ak[1] : maxAk; };
            // 材料选择点击事件,更新索引值
            propLi.addEventListener('click', () => {
                document.getElementById('material-name').textContent = `${mat}-${prop.status}`
                const current_mat = propLi.getAttribute('data-material')
                const current_propIndex = propLi.getAttribute('data-property')
                
                window.location.search = `?material=${current_mat}&property=${current_propIndex}`;
                showMaterial(current_mat, current_propIndex)
            })
            propIndex++;
        })
        materialList.appendChild(matLi)
    })
    // 初始化默认显示第一个材料
    showMaterial(materials[0]);
    document.getElementById('material-name').textContent = `${materials[0]}-${matData[materials[0]].properties[0].status}`
})

// 显示材料性能, 默认第一个属性
function showMaterial(material, propIndex = 0) {
    const data = matData[material].properties[propIndex];
    if (!data) return;
    const properties = ['modulus', 'poisson', 'yield', 'G', 'Z', 'A', 'tensile', 'compress', 'bending', 'shearing', 'fatigued', 'HR', 'HBW', 'HV', 'Kic', 'Ak' ];
    // 更新柱状图和数值

    properties.forEach(prop => {
        if(data[prop]) {
            eval(`${prop} = (data.${prop}[1] / max${prop.charAt(0).toUpperCase() + prop.slice(1)}).toFixed(3) * 100`)
        } else {
            eval(`${prop} = 1`)
        }
        document.getElementById(`${prop}-bar`).style.width = `${eval(prop)}%`;
        document.getElementById(`${prop}-title`).textContent = data[prop] ? data[prop][0] : '--';
        document.getElementById(`${prop}-value`).textContent = data[prop] ? data[prop][1] : '--';
    })
}