<template>
  <div>
    <header-bar
      style="padding: 0.5em"
      :style="{
        height: isMobile && isLandscape ? '3em' : '4em',
        padding: isMobile && isLandscape ? '0 0.5em' : '0.5em',
      }"
    >
      <button
        v-if="!isEditItem && !addNew && !isItemReview && !isSetting"
        class="action"
        @click="logout"
        :title="$t('reminder.logout')"
      >
        <i style="color: blue" class="material-icons">logout</i>
      </button>

      <button
        v-if="isEditItem || addNew || isItemReview || isSetting"
        class="action"
        @click="exitToList"
        :title="$t('reminder.return')"
      >
        <i style="color: red" class="material-icons">turn_left</i>
      </button>

      <button
        v-if="unsavedTask !== '' || unSavedAttach !== '' || unDeleted !== ''"
        class="action"
        @click="showConfirmUpload"
        :title="$t('reminder.upload')"
      >
        <i style="color: red" class="material-icons">upload</i>
      </button>

      <title style="flex-grow: 1; white-space: nowrap; padding: 0 0.5em">
        {{ $t("reminder.reminder") }}
      </title>
      <span
        :style="{
          flexGrow: isMobile ? '1' : '0',
        }"
      >
      </span>

      <button
        v-if="!(isEditItem || addNew)"
        :disabled="isSetting"
        class="action"
        :style="{
          color: isSetting ? 'grey' : 'blue',
        }"
        @click="addNewItem"
        :title="$t('reminder.addNew')"
      >
        <i class="material-icons">add_card</i>
      </button>

      <button
        v-if="isEditItem || addNew"
        class="action"
        style="color: red"
        @click="submitItem"
        :title="$t('reminder.submit')"
      >
        <i class="material-icons">save</i>
      </button>

      <button
        class="action"
        @click="onSetting"
        :disabled="addNew || isEditItem"
        :title="$t('repeater.settings')"
      >
        <i
          :style="{
            color: isEditItem || addNew ? 'grey' : isSetting ? 'red' : 'blue',
          }"
          class="material-icons"
          >settings</i
        >
      </button>
    </header-bar>

    <div
      id="showAddNewOrEdit"
      v-if="addNew || isEditItem"
      style="
        background-color: #cdcdcd;
        color: black;
        z-index: 1012;
        position: fixed;
        left: 50%;
        transform: translate(-50%, 0);
        top: 4.2em;
        bottom: 0.2em;
        border-radius: 10px;
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-y: auto;
      "
      :style="{
        width: isMobile ? '100%' : '65%',
      }"
    >
      <p v-if="addNew" style="padding: 0 1em; color: blue">
        {{ $t("reminder.addNew") }}&nbsp;&nbsp;&nbsp;{{ getDateAfterDays(0) }}
      </p>
      <p v-if="isEditItem" style="padding: 0 1em; color: blue">
        {{ $t("reminder.editTask") }} &nbsp;&nbsp;&nbsp;{{
          getDateAfterDays(0)
        }}
      </p>

      <p style="padding: 0 1em; color: blue">
        <span
          style="
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin: 0 0 0.5em 0;
          "
        >
          {{ $t("reminder.types") }}
          <span
            @click="switchTab(1)"
            style="
              cursor: pointer;
              margin: 0 0 0 1em;
              background-color: #d7d7d7;
            "
            :style="{
              color: isType == '1' ? 'blue' : 'black',
            }"
          >
            {{ $t("reminder.Regular Task") }}
          </span>
          <span
            @click="switchTab(2)"
            style="
              cursor: pointer;
              margin: 0 0 0 1em;
              background-color: #d7d7d7;
            "
            :style="{
              color: isType == '2' ? 'blue' : 'black',
            }"
          >
            {{ $t("reminder.Recitation Task") }}</span
          >
          <span
            @click="switchTab(3)"
            style="
              cursor: pointer;
              margin: 0 0 0 1em;
              background-color: #d7d7d7;
            "
            :style="{
              color: isType == '3' ? 'blue' : 'black',
            }"
          >
            {{ $t("reminder.Memo") }}</span
          >
        </span>
      </p>
      <p style="padding: 0 1em; color: blue; margin: 1em 0 0 0">
        {{ $t("reminder.front") }}
        <button class="action" @click="uploadFile(1)">
          <i style="color: blue; font-size: 1.2em" class="material-icons"
            >attachment</i
          >
        </button>
      </p>
      <input
        style="display: none"
        type="file"
        id="upload-input1"
        @change="uploadInput($event, 1)"
        multiple
      />

      <div
        v-if="!arrFrontAtt == []"
        style="margin: 0px 1rem; padding: 0; font-size: 0.9em"
      >
        <ul
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            list-style: none;
            padding: 0;
            margin: 0;
          "
        >
          <li
            v-for="(subtitle, index) in arrFrontAtt"
            :key="index"
            :id="index + 1"
            style="margin: 0 10px; color: blue; cursor: pointer"
          >
            <i @click="calcHref(subtitle)"
              >{{ $t("reminder.attach") }} {{ index + 1 }}</i
            >
            <button class="action" @click="deleteAttach(index, 1)">
              <i style="color: grey; font-size: 0.8em" class="material-icons"
                >delete</i
              >
            </button>
          </li>
        </ul>
      </div>

      <textarea
        v-model.lazy="newItemLine1"
        placeholder="...can't leave blank..."
        rows="6"
        style="
          width: calc(100% - 2em);
          margin: 0 1em;
          text-align: center;
          background-color: white;
          color: black;
          border: none;
          resize: none;
        "
      ></textarea>
      <p style="padding: 0 1em; color: blue; margin: 1em 0 0 0">
        {{ $t("reminder.back") }}
        <button class="action" @click="uploadFile(2)">
          <i style="color: blue; font-size: 1.2em" class="material-icons"
            >attachment</i
          >
        </button>
      </p>
      <input
        style="display: none"
        type="file"
        id="upload-input2"
        @change="uploadInput($event, 2)"
        multiple
      />
      <div
        v-if="!arrBackAtt == []"
        style="margin: 0px 1rem; padding: 0; font-size: 0.9em"
      >
        <ul
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            list-style: none;
            padding: 0;
            margin: 0;
          "
        >
          <li
            v-for="(subtitle, index) in arrBackAtt"
            :key="index"
            :id="index + 1"
            style="margin: 0 10px; color: blue; cursor: pointer"
          >
            <i @click="calcHref(subtitle)"
              >{{ $t("reminder.attach") }} {{ index + 1 }}</i
            >
            <button class="action" @click="deleteAttach(index, 2)">
              <i style="color: grey; font-size: 0.8em" class="material-icons"
                >delete</i
              >
            </button>
          </li>
        </ul>
      </div>

      <textarea
        v-model.lazy="newItemLine2"
        placeholder="...may leave blank..."
        rows="6"
        style="
          width: calc(100% - 2em);
          margin: 0 1em;
          text-align: center;
          background-color: white;
          color: black;
          border: none;
          resize: none;
        "
      ></textarea>
      <p style="padding: 0 1em; color: blue; margin: 1em 0 0 0">
        {{ $t("reminder.tag") }}
      </p>
      <textarea
        v-model.lazy="newItemLine3"
        placeholder="seperate with ';'"
        rows="1"
        style="
          width: calc(100% - 2em);
          margin: 0 1em;
          text-align: center;
          background-color: white;
          color: black;
          border: none;
          resize: none;
        "
      ></textarea>
      <div>
        <ul
          v-if="true"
          style="
            display: flex;
            border-radius: 20px;
            overflow-x: auto;
            list-style: none;
            padding: 0;
            margin: 0px 1em;
          "
        >
          <li
            v-for="(subtitle, index) in arrTags"
            :key="index"
            :id="index + 1"
            style="margin: 0 10px; background: #d7d7d7"
            @click="addTags(index)"
          >
            <span
              style="cursor: pointer"
              :style="{
                color: newItemLine3.split(';').includes(subtitle)
                  ? 'blue'
                  : 'black',
              }"
            >
              {{ subtitle }}
            </span>
          </li>
        </ul>
      </div>
      <p style="padding: 0 1em; color: blue">{{ $t("reminder.repDate") }}</p>
      <p v-if="isType == '3'" style="color: blue; margin-left: 2em">
        <input type="checkbox" disabled v-model="isNone" />
        {{ $t("reminder.none") }}
      </p>
      <p
        v-if="isType == '1'"
        :style="{
          color: isEvery ? 'blue' : 'black',
        }"
        style="margin-left: 2em"
      >
        <input type="checkbox" :disabled="isEvery" v-model="isEvery" />
        {{ $t("reminder.every") }}
        <input
          class="input input--repeater"
          :disabled="!isEvery"
          style="width: 3.5em; margin: 0; padding: 0"
          type="number"
          min="1"
          v-model.number="numOf"
        />

        <select v-model="selectedType" :disabled="!isEvery">
          <option
            v-for="option in tpyeOptions"
            :value="option.value"
            :key="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </p>

      <p
        v-if="isType == '1' && isEvery && selectedType == '2'"
        style="color: blue; margin-left: 3rem; font-size: 0.9em"
      >
        <input type="checkbox" v-model="isSun" />
        {{ $t("reminder.sun") }}
        <input type="checkbox" v-model="isMon" />
        {{ $t("reminder.mon") }}
        <input type="checkbox" v-model="isTue" />
        {{ $t("reminder.tue") }}
        <input type="checkbox" v-model="isWed" />
        {{ $t("reminder.wed") }}
        <input type="checkbox" v-model="isThu" />
        {{ $t("reminder.thu") }}
        <input type="checkbox" v-model="isFri" />
        {{ $t("reminder.fri") }}
        <input type="checkbox" v-model="isSat" />
        {{ $t("reminder.sat") }}
      </p>

      <p
        v-if="isType == '1'"
        :style="{
          color: isCustom ? 'blue' : 'black',
        }"
        style="margin-left: 2em"
      >
        <input type="checkbox" :disabled="isCustom" v-model="isCustom" />
        {{ $t("reminder.custom") }}
      </p>

      <p
        v-if="isType == '2'"
        :style="{
          color: isCurve ? 'blue' : 'black',
        }"
        style="margin-left: 2em"
      >
        <input type="checkbox" disabled v-model="isCurve" />
        {{ $t("reminder.ebbinghaus") }}
      </p>

      <p v-if="isCustom && isType == '1'" style="padding: 0; margin-left: 3em">
        {{ $t("reminder.days") }}
        <input
          class="input input--repeater"
          style="width: 9em; margin: 0; padding: 0"
          type="text"
          v-model="curveDays"
        />
      </p>

      <p v-if="isCurve && isType == '2'" style="padding: 0; margin-left: 3em">
        {{ $t("reminder.days") }}
        <input
          class="input input--repeater"
          style="width: 9em; margin: 0; padding: 0"
          type="text"
          v-model="curveDays"
        />
      </p>
      <p
        v-if="isType == '1'"
        :style="{
          color: isOnce ? 'blue' : 'black',
        }"
        style="margin-left: 2em"
      >
        <input type="checkbox" :disabled="isOnce" v-model="isOnce" />
        {{ $t("reminder.once") }}
      </p>

      <p
        v-if="isType !== '3'"
        style="padding: 0 1em; margin-left: 1em; color: blue"
      >
        {{ $t("reminder.startDate") }}
        <input type="date" v-model.lazy="startDate" />
      </p>
      <div
        v-if="isType !== '3'"
        style="padding: 0 1em; margin-left: 1em; color: blue"
      >
        {{ $t("reminder.endDate") }}
        <span
          :style="{
            color: isNever ? 'blue' : 'black',
          }"
        >
          <input type="checkbox" :disabled="isNever" v-model="isNever" />
          {{ $t("reminder.neverEnd") }}
        </span>
        <span
          :style="{
            color: hasEnd ? 'blue' : 'black',
          }"
        >
          <input type="checkbox" :disabled="hasEnd" v-model="hasEnd" />
          <input type="date" :disabled="isNever" v-model.lazy="endDate" />
        </span>
      </div>

      <p
        v-if="isType !== '3'"
        style="padding: 0 1em; margin-left: 1em; color: blue"
      >
        {{ $t("reminder.comingDate") }}
        {{ day1 }}&nbsp; {{ day2 }}&nbsp; {{ day3 }}&nbsp; {{ day4 }}
      </p>

      <p v-if="isType !== '3'" style="padding: 0 1em; color: blue">
        {{ $t("reminder.execTime") }} HH
        <input
          class="input input--repeater"
          style="width: 3.5em; margin: 0; padding: 0"
          type="number"
          min="0"
          max="23"
          v-model.number="reviewHour"
        />
        MM
        <input
          class="input input--repeater"
          style="width: 3.5em; margin: 0; padding: 0"
          type="number"
          min="0"
          max="59"
          v-model.number="reviewMinute"
        />
      </p>
      <div>
        <p style="padding: 0 1em; color: blue">
          <input type="checkbox" v-model="importantDaily" />
          {{ $t("reminder.important1") }}
        </p>
      </div>
      <div v-if="false && isEditItem">
        <p style="padding: 0 1em; color: blue">
          <input type="checkbox" :disabled="addNew" v-model="disabledDaily" />
          disabled(will not show in the daily list but will keep in the whole
          list)
        </p>
      </div>
    </div>

    <div
      id="showList"
      v-if="isShowList"
      style="
        z-index: 1000;
        display: flex;
        flex-direction: column;
        position: fixed;
        background: whitesmoke;
        left: 50%;
        transform: translate(-50%, 0);
        top: 4.2em;
        bottom: 0.2em;
      "
      :style="{
        width: isMobile ? '100%' : '65%',
      }"
    >
      <div
        style="
          color: blue;
          font-size: 1.2em;
          margin: 0 1rem;
          font-family: Times, serif;
          height: 3em;
        "
      >
        <p v-if="!isShowAllList" style="display: flex">
          <span> {{ $t("reminder.dailyList") }} &nbsp;&nbsp;</span>
          <span style="font-size: 0.7em; flex-grow: 1"
            ><input type="date" v-model.lazy="selectedDate"
          /></span>
          <button
            style="
              color: blue;
              display: inline-block;
              cursor: pointer;
              background-color: whitesmoke;
              border: 0;
              margin: 0;
              padding: 0;
            "
            @click="showAllList"
          >
            <i class="material-icons">checklist_rtl</i>
          </button>
        </p>
        <p v-if="isShowAllList" style="display: flex">
          <span style="flex-grow: 1"> {{ $t("reminder.wholeList") }} </span>
          <button
            style="
              color: blue;
              display: inline-block;
              cursor: pointer;
              background-color: whitesmoke;
              border: 0;
              margin: 0;
              padding: 0;
            "
            @click="showAllList"
          >
            <i class="material-icons">format_list_bulleted</i>
          </button>
        </p>
      </div>
      <div style="display: flex; margin: 0 1em">
        <input
          style="flex-grow: 1"
          type="text"
          placeholder=" Search "
          v-model="searchList"
        />
        <span
          v-if="!isDropDown"
          style="
            background-color: white;
            cursor: pointer;
            margin: 0.5em 0 0 0.5em;
          "
          @click="showDropDown"
          >&or;</span
        >
        <span
          v-if="isDropDown"
          style="
            background-color: #cdcdcd;
            cursor: pointer;
            margin: 0.5em 0 0 0.5em;
          "
          @click="showDropDown"
          >&and;</span
        >
      </div>

      <div
        v-if="isDropDown"
        style="
          background: white;
          padding: 0 0 1em 0;
          margin: 0.5em 1em 0 1em;
          font-size: 0.9em;
        "
      >
        <p style="margin: 0; padding: 0.5em">{{ $t("reminder.types") }}</p>
        <div style="margin: 0px 1rem; padding: 0; font-size: 0.9em">
          <ul
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              list-style: none;
              padding: 0;
              margin: 0;
            "
          >
            <li
              v-for="(subtitle, index) in arrTypes"
              :key="index"
              :id="index + 1"
              style="margin: 0 10px"
              :style="{
                backgroundColor: selectedTypes.includes(subtitle)
                  ? 'indigo'
                  : 'grey',
              }"
              @click="calcType(index)"
            >
              <span style="cursor: pointer; color: white">
                {{ $t("reminder." + subtitle) }}
              </span>
            </li>
          </ul>
        </div>

        <p style="margin: 0; padding: 0.5em">{{ $t("reminder.tags") }}</p>
        <div style="margin: 0px 1rem; padding: 0; font-size: 0.9em">
          <ul
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              list-style: none;
              padding: 0;
              margin: 0;
            "
          >
            <li
              v-for="(subtitle, index) in arrTags"
              :key="index"
              :id="index + 1"
              style="margin: 0 10px"
              :style="{
                backgroundColor: selectedTags.includes('*' + subtitle)
                  ? 'indigo'
                  : 'grey',
              }"
              @click="calcItem(index)"
            >
              <span style="cursor: pointer; color: white">
                {{ subtitle }}
              </span>
            </li>
          </ul>
        </div>

        <p style="margin: 0; padding: 0.5em">{{ $t("reminder.specials") }}</p>
        <div style="margin: 0px 1rem; padding: 0; font-size: 0.9em">
          <ul
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              list-style: none;
              padding: 0;
              margin: 0;
            "
          >
            <li
              v-for="(subtitle, index) in arrSpecials"
              :key="index"
              :id="index + 1"
              style="margin: 0 10px"
              :style="{
                backgroundColor: selectedSpecials.includes(subtitle)
                  ? 'indigo'
                  : 'grey',
              }"
              @click="calcSpecials(index)"
            >
              <span style="cursor: pointer; color: white">
                {{ $t("reminder." + subtitle) }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div style="overflow-y: auto; flex-grow: 1">
        <ul
          v-if="itemList !== ''"
          style="
            position: relative;
            width: 100%;
            padding: 0 1em;
            list-style: none;
          "
        >
          <li
            v-for="(subtitle, index) in itemContent"
            :key="index"
            :id="index + 1"
          >
            <p
              v-if="isShowAllList"
              :style="{
                color: arrIsImpt[index] ? 'red' : 'blue',
              }"
            >
              <span @click="showItemReview(index)" style="cursor: pointer">
                {{ index + 1 }}. {{ subtitle.split("\n\t")[1] }}
              </span>
            </p>

            <p
              v-if="!isShowAllList"
              :style="{
                color: !isTodayEarly
                  ? 'black'
                  : arrIsImpt[index] && arrIsDue[index]
                  ? 'red'
                  : arrIsDue[index]
                  ? 'blue'
                  : 'grey',
              }"
            >
              <span
                v-if="!isTodayEarly"
                style="
                  border: 0;
                  margin: 0;
                  padding: 0;
                  font-size: 0.8em;
                  background-color: #dadce4;
                  border-radius: 5px;
                "
              >
                {{ $t("reminder.status03") }}
              </span>
              <span
                v-if="isTodayEarly && arrIsDue[index]"
                style="
                  border: 0;
                  margin: 0;
                  padding: 0;
                  font-size: 0.8em;
                  background-color: #dadce4;
                  border-radius: 5px;
                  cursor: pointer;
                "
                @click="switchDone(index)"
                :title="$t('reminder.switchStatus')"
              >
                {{ $t("reminder.status01") }}
              </span>
              <span
                v-if="isTodayEarly && !arrIsDue[index]"
                style="
                  border: 0;
                  margin: 0;
                  padding: 0;
                  font-size: 0.8em;
                  background-color: #dadce4;
                  border-radius: 5px;
                  cursor: pointer;
                "
                @click="switchDone(index)"
                :title="$t('reminder.switchStatus')"
              >
                {{ $t("reminder.status02") }}
              </span>
              <span @click="showItemReview(index)" style="cursor: pointer">
                &nbsp;&nbsp;{{ index + 1 }}&nbsp;
                {{
                  subtitle.split("\n\t")[4].split("::repeatType:")[0]
                }}&nbsp;&nbsp;&nbsp;
                {{ subtitle.split("\n\t")[1] }}
              </span>
            </p>

            <hr style="border: none; border-top: 1px solid black; height: 0" />
          </li>
        </ul>
        <div
          v-if="itemList == ''"
          style="padding: 0 1em; position: relative; width: 100%"
        >
          <p style="text-align: justify">
            {{ $t("reminder.ins01") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins02") }}
            <i style="color: blue" class="material-icons">add_card</i
            >{{ $t("reminder.ins03") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins04") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins05") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins06") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins07") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins08") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins09") }}
            <i style="color: blue" class="material-icons">checklist_rtl</i
            >{{ $t("reminder.ins10") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins11") }}
            &nbsp;&or;&nbsp;
            {{ $t("reminder.ins12") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins13") }}
            <span style="font-size: 0.8em">
              &nbsp;{{ $t("reminder.status01") }}&nbsp;
            </span>
            {{ $t("reminder.ins14") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins15") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins16") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins17") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins18") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins19") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins20") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins21") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins22") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins23") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins24") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins25") }}
          </p>
        </div>
        <p
          v-if="!isShowAllList && itemContent.length !== 0"
          style="
            padding: 0 1em;
            position: relative;
            width: 100%;
            text-align: right;
            font-size: 0.8em;
          "
        >
          {{ $t("reminder.markedAll") }}

          <button
            style="
              color: blue;
              display: inline-block;
              cursor: pointer;
              background-color: whitesmoke;
              border: 0;
              margin: 0;
              padding: 0;
            "
            @click="markAllAsDone"
          >
            <i class="material-icons">check_box</i>
          </button>
        </p>
      </div>
    </div>

    <div
      id="show reviewPage"
      v-if="isItemReview"
      style="
        background-color: whitesmoke;
        z-index: 1010;
        position: fixed;
        left: 50%;
        transform: translate(-50%, 0);
        top: 4.2em;
        bottom: 0.2em;
      "
      :style="{
        width: isMobile ? '100%' : '65%',
      }"
    >
      <div
        id="show reviewPageInside"
        style="
          background-color: #cdcdcd;
          color: white;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 0.2em;
          bottom: 4.2em;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          width: calc(100% - 1em);
        "
      >
        <div
          style="
            margin: 1rem;
            padding: 0px;
            font-size: 0.9em;
            text-align: center;
          "
        >
          <span style="color: blue">
            {{ sentenceIndex }}
            /{{ itemContent.length }}
            &nbsp;&nbsp;&nbsp;
            {{ frontAndBack }}
          </span>
        </div>

        <div
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          style="
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            display: flex;
            white-space: pre-line;
            word-break: break-all;
          "
        >
          <p style="padding: 0 1em; color: blue">
            {{ itemContent[sentenceIndex - 1].split("\n\t")[contentIndex] }}
          </p>
        </div>
        <div
          v-if="contentIndex == 1 && !arrFrontAtt == []"
          style="margin: 0px 1rem; padding: 0; font-size: 0.9em"
        >
          <ul
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              list-style: none;
              padding: 1em 0;
              margin: 0;
            "
          >
            <li
              v-for="(subtitle, index) in arrFrontAtt"
              :key="index"
              :id="index + 1"
              style="margin: 0; color: blue; cursor: pointer"
            >
              <i @click="calcHref(subtitle)"
                >{{ $t("reminder.attach") }} {{ index + 1 }}</i
              >
            </li>
          </ul>
        </div>

        <div
          v-if="contentIndex == 2 && !arrBackAtt == []"
          style="margin: 0px 1rem; padding: 0; font-size: 0.9em"
        >
          <ul
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              list-style: none;
              padding: 1em 0;
              margin: 0;
            "
          >
            <li
              v-for="(subtitle, index) in arrBackAtt"
              :key="index"
              :id="index + 1"
              style="margin: 0; color: blue; cursor: pointer"
            >
              <i @click="calcHref(subtitle)"
                >{{ $t("reminder.attach") }} {{ index + 1 }}</i
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        style="
          background-color: #cdcdcd;
          color: white;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          height: 3.8em;
          bottom: 0.2em;
          border-radius: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          width: calc(100% - 1em);
        "
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            width: calc(100% - 2em);
            flex-grow: 1;
            margin: 1em;
          "
        >
          <span
            v-if="!isShowAllList && !isTodayEarly"
            style="
              border: 0;
              margin: 0;
              padding: 0;
              font-size: 0.8em;
              background-color: #262626;
              border-radius: 5px;
            "
          >
            {{ $t("reminder.status03") }}
          </span>
          <span
            v-if="!isShowAllList && isTodayEarly && arrIsDue[sentenceIndex - 1]"
            style="
              border: 0;
              margin: 0;
              padding: 0;
              font-size: 0.8em;
              background-color: blue;
              border-radius: 5px;
              cursor: pointer;
            "
            @click="switchDone(sentenceIndex - 1)"
            :title="$t('reminder.switchStatus')"
          >
            {{ $t("reminder.status01") }}
          </span>
          <span
            v-if="
              !isShowAllList && isTodayEarly && !arrIsDue[sentenceIndex - 1]
            "
            style="
              border: 0;
              margin: 0;
              padding: 0;
              font-size: 0.8em;
              background-color: #888888;
              border-radius: 5px;
              cursor: pointer;
            "
            @click="switchDone(sentenceIndex - 1)"
            :title="$t('reminder.switchStatus')"
          >
            {{ $t("reminder.status02") }}
          </span>
          <span v-if="!isShowAllList"> &nbsp;&nbsp; </span>
          <span style="color: blue; flex-grow: 1">
            {{ $t("reminder.lastReviewedDate") }}
            {{ lastReviewedDate }}
          </span>
          <button
            style="
              color: blue;
              cursor: pointer;
              background-color: #cdcdcd;
              border: 0;
              margin: 0;
              padding: 0;
            "
            @click="showEditItem"
            :title="$t('reminder.edit')"
          >
            <i class="material-icons">edit</i>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            v-if="false"
            style="
              color: blue;
              cursor: pointer;
              background-color: #cdcdcd;
              border: 0;
              margin: 0;
              padding: 0;
            "
            @click="switchImportant"
            :title="$t('reminder.switchImportant')"
          >
            <i class="material-icons">star</i>
          </button>
          <button
            style="
              color: blue;
              cursor: pointer;
              background-color: #cdcdcd;
              border: 0;
              margin: 0;
              padding: 0;
            "
            @click="showConfirmDelete"
            :title="$t('reminder.delete')"
          >
            <i class="material-icons">delete</i>
          </button>
        </div>
      </div>
    </div>

    <div id="settingBoxContainer" v-if="isSetting">
      <div id="settingBox" style="background-color: #cdcdcd">
        <p style="color: blue; font-weight: bold; padding-top: 0em">
          {{ $t("repeater.settings") }}
        </p>

        <div style="display: block">
          <p>
            <span style="color: black">
              <input
                :disabled="isAutoDetectLang"
                type="checkbox"
                v-model="isUtterTransLine"
              />
              {{ $t("reminder.utter") }}
            </span>
            <span style="color: black">
              (<input type="checkbox" v-model="isAutoDetectLang" />
              {{ $t("repeater.autoDetect") }})
            </span>
          </p>
          <div
            :style="{ color: isUtterTransLine ? 'black' : '#868686' }"
            :disabled="!isUtterTransLine"
          >
            <p style="margin-bottom: 0">
              <input
                :disabled="!isUtterTransLine"
                style="margin-left: 1em"
                type="radio"
                value="Yes"
                v-model="isSystemTTS"
              />
              <span>{{ $t("repeater.systemTTS") }}</span>
            </p>

            <p
              v-if="!hasSpeechSynthesis"
              style="color: red; margin-left: 2rem; font-size: 0.8em"
            >
              {{ $t("repeater.speechsynthesisAlert") }}
            </p>

            <p
              style="margin: 0.5em 0 1em 2rem; font-size: 0.8em"
              :style="{
                color:
                  isSystemTTS == 'Yes' && isUtterTransLine
                    ? 'black'
                    : '#868686',
              }"
            >
              {{ $t("repeater.SystemTTSnote") }}
            </p>

            <div style="display: flex; align-items: center">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#868686'
                      : 'black',
                }"
                style="margin-left: 2em; width: 60%"
                class="subject"
              >
                {{ $t("reminder.langinfrontside") }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  isAutoDetectLang ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="text"
                :placeholder="langInTransLinedefault"
                v-model="langInFrontSide"
              />
            </div>

            <div style="display: flex; align-items: center">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#868686'
                      : 'black',
                }"
                style="margin-left: 3em; width: calc(60% - 1em)"
                class="subject"
              >
                {{
                  $t("repeater.voice", {
                    totalvoices: totalReadersFront,
                  })
                }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="number"
                v-model.number.lazy="readerFront"
                :style="{
                  width: isMobile ? '3em' : '6em',
                }"
              />
              <button
                :disabled="
                  isSystemTTS == 'No' ||
                  !isUtterTransLine ||
                  !hasSpeechSynthesis
                "
                class="action"
                @click="testTTSVoiceFront"
                :title="$t('repeater.testTTSVoiceFront')"
              >
                <i
                  :style="{
                    color:
                      isSystemTTS == 'No' || !isUtterTransLine
                        ? '#868686'
                        : 'blue',
                  }"
                  class="material-icons"
                  >play_circle_outline</i
                >
              </button>
            </div>

            <div style="display: flex; align-items: center">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#868686'
                      : 'black',
                }"
                style="margin-left: 3em; width: calc(60% - 1em)"
                class="subject"
              >
                {{ $t("reminder.speedOfUttering") }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="text"
                v-model.number.lazy="speedOfUtterFront"
              />
            </div>

            <div style="display: flex; align-items: center">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#868686'
                      : 'black',
                }"
                style="margin-left: 2em; width: 60%"
                class="subject"
              >
                {{ $t("reminder.langInbackside") }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  isAutoDetectLang ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="text"
                :placeholder="langInTransLinedefault"
                v-model="langInBackSide"
              />
            </div>

            <div style="display: flex; align-items: center">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#868686'
                      : 'black',
                }"
                style="margin-left: 3em; width: calc(60% - 1em)"
                class="subject"
              >
                {{
                  $t("repeater.voice", {
                    totalvoices: totalReadersBack,
                  })
                }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="number"
                v-model.number.lazy="readerBack"
                :style="{
                  width: isMobile ? '3em' : '6em',
                }"
              />
              <button
                :disabled="
                  isSystemTTS == 'No' ||
                  !isUtterTransLine ||
                  !hasSpeechSynthesis
                "
                class="action"
                @click="testTTSVoiceBack"
                :title="$t('repeater.testTTSVoiceBack')"
              >
                <i
                  :style="{
                    color:
                      isSystemTTS == 'No' || !isUtterTransLine
                        ? '#868686'
                        : 'blue',
                  }"
                  class="material-icons"
                  >play_circle_outline</i
                >
              </button>
            </div>

            <div style="display: flex; align-items: center">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#868686'
                      : 'black',
                }"
                style="margin-left: 3em; width: calc(60% - 1em)"
                class="subject"
              >
                {{ $t("reminder.speedOfUttering") }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="text"
                v-model.number.lazy="speedOfUtterBack"
              />
            </div>

            <p style="margin-bottom: 0">
              <input
                :disabled="!isUtterTransLine"
                style="margin-left: 1em"
                type="radio"
                value="No"
                v-model="isSystemTTS"
              />
              <span>{{ $t("repeater.notSystemTTS") }}</span>
              <button
                :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
                class="action"
                @click="resetTTSurl"
                :title="$t('repeater.resetTTSurl')"
              >
                <i
                  :style="{
                    color:
                      isSystemTTS == 'Yes' || !isUtterTransLine
                        ? '#868686'
                        : 'blue',
                  }"
                  class="material-icons"
                  >settings_backup_restore</i
                >
              </button>
              <button
                :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
                class="action"
                @click="testTTSurl"
                :title="$t('repeater.testTTSurl')"
              >
                <i
                  :style="{
                    color:
                      isSystemTTS == 'Yes' || !isUtterTransLine
                        ? '#868686'
                        : 'blue',
                  }"
                  class="material-icons"
                  >play_circle_outline</i
                >
              </button>
            </p>
            <p
              style="margin-left: 2em"
              :style="{
                color:
                  isSystemTTS == 'No' && isUtterTransLine ? 'black' : '#868686',
              }"
            >
              {{ $t("reminder.frontWithLang") }}
            </p>
            <input
              style="
                margin: 0 0 0.5em 2em;
                width: calc(100% - 2em);
                text-align: left;
              "
              :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
              class="input input--repeater"
              type="text"
              v-model.lazy="TTSurlFront"
            />
            <p
              style="margin-left: 2em"
              :style="{
                color:
                  isSystemTTS == 'No' && isUtterTransLine ? 'black' : '#868686',
              }"
            >
              {{ $t("reminder.backWithLang") }}
            </p>
            <input
              style="
                margin: 0 0 0.5em 2em;
                width: calc(100% - 2em);
                text-align: left;
              "
              :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
              class="input input--repeater"
              type="text"
              v-model.lazy="TTSurlBack"
            />
            <p
              style="
                margin: 0 0 1em 2rem;
                text-align: justify;
                text-align-last: left;
                word-wrap: break-word;
                overflow-wrap: break-word;
                word-break: break-all;
                font-size: 0.8em;
              "
              :style="{
                color:
                  isSystemTTS == 'No' && isUtterTransLine ? 'black' : '#868686',
              }"
            >
              {{ $t("repeater.notSystemTTSnote") }}
            </p>
          </div>

          <p style="color: black">
            <input type="checkbox" v-model="autoPlay" />
            {{ $t("repeater.autoPlayCurrentSentence") }}
          </p>

          <div>
            <p style="color: black; text-align: justify; text-align-last: left">
              <input disabled="true" type="checkbox" v-model="allowOffline" />
              {{ $t("reminder.offlineApp") }}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid black; height: 0" />
        </div>
        <div style="color: black">
          <p style="color: blue; font-weight: bold; padding-top: 2em">
            {{ $t("repeater.instructions") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins02") }}
            <i style="color: blue" class="material-icons">add_card</i
            >{{ $t("reminder.ins03") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins04") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins05") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins06") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins07") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins08") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins09") }}
            <i style="color: blue" class="material-icons">checklist_rtl</i
            >{{ $t("reminder.ins10") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins11") }}
            &nbsp;&or;&nbsp;
            {{ $t("reminder.ins12") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins13") }}
            <span style="font-size: 0.8em">
              &nbsp;{{ $t("reminder.status01") }}&nbsp;
            </span>
            {{ $t("reminder.ins14") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins15") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins16") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins17") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins18") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins19") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins20") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins21") }}
          </p>

          <p style="text-align: justify">
            {{ $t("reminder.ins22") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins23") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins24") }}
          </p>
          <p style="text-align: justify">
            {{ $t("reminder.ins25") }}
          </p>
          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <p style="color: blue; font-weight: bold; padding-top: 2em">
            {{ $t("repeater.updatesandComments") }}
          </p>
          <p>
            {{ $t("repeater.github") }}
            <a
              href="https://github.com/niubility000/PDJ-Media-Repeater"
              target="_blank"
              style="color: blue"
            >
              https://github.com/niubility000/PDJ-Media-Repeater</a
            >
          </p>
          <p>
            {{ $t("repeater.youdao") }}
            <a
              href="https://note.youdao.com/s/MI81scdr"
              target="_blank"
              style="color: blue"
            >
              https://note.youdao.com/s/MI81scdr</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { files as api } from "@/api";
import HeaderBar from "@/components/header/HeaderBar.vue";
import * as auth from "@/utils/auth";
import localforage from "localforage";

export default {
  name: "reminder",
  components: {
    HeaderBar,
  },
  data: function () {
    return {
      sentenceIndex: 1,
      allowOffline: Number(window.localStorage.getItem("isOffline")) == 1,
      isLandscape: this.checkLandscape(),
      addNew: false,
      isShowList: true,
      isShowAllList: false,
      newItemLine1: "",
      newItemLine2: "",
      newItemLine3: "",
      itemContent: [],
      itemList: "",
      savedContent: "",
      tags: "",
      selectedTags: [],
      selectedTypes: "",
      selectedSpecials: "",
      selectedWords: [],
      arrTypes: ["Regular Task", "Recitation Task", "Memo"],
      arrSpecials: ["important", "With Attachments"],
      isOnce: false,
      isEvery: true,
      isCustom: false,
      isCurve: true,
      numOf: 1,
      selectedType: "1",
      tpyeOptions: [
        { value: "1", text: "Day(s)" },
        { value: "2", text: "Week(s)" },
        { value: "3", text: "Month(s)" },
        { value: "4", text: "Year(s)" },
      ],
      isMon: true,
      isTue: true,
      isWed: true,
      isThu: true,
      isFri: true,
      isSat: false,
      isSun: false,
      curveDays: "1 3 7 15 30 60 120",
      isNever: true,
      hasEnd: false,
      today: new Date().toLocaleDateString("af").replaceAll("/", "-"),
      startDate: new Date().toLocaleDateString("af").replaceAll("/", "-"),
      endDate: this.getDateAfterDays(7, 1),
      latestReviewDate: "1900-01-01",
      reviewHour: 8,
      reviewMinute: 0,
      importantDaily: false,
      disabledDaily: false,
      selectedDate: new Date().toLocaleDateString("af").replaceAll("/", "-"),
      isItemReview: false,
      contentIndex: 1,
      isEditItem: false,
      itemId: "",
      touches: 0,
      isSetting: false,
      isUtterTransLine: true,
      speedOfUtter: 1,
      speedOfUtterFront: 1,
      speedOfUtterBack: 1,
      langInFrontSide: navigator.language || navigator.userLanguage,
      langInTransLinedefault: navigator.language || navigator.userLanguage,
      langInBackSide: navigator.language || navigator.userLanguage,
      isAutoDetectLang: true,
      isSystemTTS: "Yes",
      resized: false,
      hasSpeechSynthesis:
        !!window.speechSynthesis || "speechSynthesis" in window,
      utterThis: null,
      audio: null,
      autoPlay: true,
      reader: 0,
      readerFront: 0,
      readerBack: 0,
      searchList: "",
      isDropDown: false,
      isType: "1",
      isNone: true,
      isInFetch: false,
      frontAttach: "",
      backAttach: "",
      attachChanged: false,
      toDoListName: "PDJ-ToDoList.txt",
      notUpload: "PDJ-ToDoList.txtNotUpload",
      unSavedAttach: window.localStorage.getItem("unSavedAttach") || "",
      unDeleted: window.localStorage.getItem("unDeleted") || "",
      unsavedTask:
        window.localStorage.getItem("PDJ-ToDoList.txtNotUpload") || "",
      TTSurlFront:
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=",
      TTSurlBack:
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=",
    };
  },

  computed: {
    ...mapState(["req", "user"]),

    isMobile() {
      return (
        /iPhone|Android/i.test(navigator.userAgent) && window.innerWidth < 736
      );
    },

    arrAllCachedAttach() {
      var tempContent1 = this.savedContent;
      tempContent1 = tempContent1.split(";.\n\t\n\t")[1];
      if (tempContent1) {
        var allList = tempContent1.split("\n\t\n\t");
        var allCA = "";
        for (let i = 0; i < allList.length; i++) {
          allCA =
            allCA +
            allList[i]
              .split("\n\t")[0]
              .split(":AttachFront")[1]
              .split(":AttachBack")[0] +
            allList[i].split("\n\t")[0].split(":AttachBack")[1];
        }
        var arrAllCA = allCA.replace(/^:::|:::$/g, "").split(":::");
        return arrAllCA;
      } else return [];
    },

    lastReviewedDate() {
      let lRD = this.itemContent[this.sentenceIndex - 1]
        .split("\n\t")[4]
        .split("::latestReviewed:")[1];
      if (lRD == "0001-01-01") return "Never!";
      else return lRD;
    },

    yesterSelectedDate() {
      const sDate = new Date(this.selectedDate);
      return new Date(sDate.getTime() - 24 * 60 * 60 * 1000)
        .toLocaleDateString("af")
        .replaceAll("/", "-");
    },

    arrFrontAtt() {
      if (this.frontAttach == "") return [];
      else return this.frontAttach.replace(/^:::|:::$/g, "").split(":::");
    },

    arrBackAtt() {
      if (this.backAttach == "") return [];
      else return this.backAttach.replace(/^:::|:::$/g, "").split(":::");
    },

    totalReadersFront() {
      if (this.hasSpeechSynthesis) {
        let voices = window.speechSynthesis.getVoices();
        let langInTransLine = this.langInFrontSide;
        let formattedLang =
          langInTransLine.substring(0, 3) +
          langInTransLine.substring(3).toUpperCase();
        return voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        }).length;
      } else return 0;
    },

    totalReadersBack() {
      if (this.hasSpeechSynthesis) {
        let voices = window.speechSynthesis.getVoices();
        let langInTransLine = this.langInBackSide;
        let formattedLang =
          langInTransLine.substring(0, 3) +
          langInTransLine.substring(3).toUpperCase();
        return voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        }).length;
      } else return 0;
    },

    arrTags() {
      return this.tags.split(";");
    },

    reviewTime() {
      let h = this.reviewHour;
      let m = this.reviewMinute;
      return (
        h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0")
      );
    },

    weekRange() {
      let wr = "";
      if (this.isSun) wr = wr + "0,";
      if (this.isMon) wr = wr + "1,";
      if (this.isTue) wr = wr + "2,";
      if (this.isWed) wr = wr + "3,";
      if (this.isThu) wr = wr + "4,";
      if (this.isFri) wr = wr + "5,";
      if (this.isSat) wr = wr + "6,";
      wr = wr.replace(/,$/, "");
      return wr;
    },

    day1() {
      var date1 = new Date(this.startDate);
      var date2 = new Date(this.today);
      const diff = date1.getTime() - date2.getTime();
      const diffDate = diff / (24 * 60 * 60 * 1000);
      var endTemp = Number(this.endDate.replaceAll("-", ""));
      if (this.isOnce) {
        return this.startDate;
      } else if (
        (this.isCurve && this.isType == "2") ||
        (this.isCustom && this.isType == "1")
      ) {
        if (!this.curveDays.split(" ")[0]) return null;
        let x = Number(diffDate) + Number(this.curveDays.split(" ")[0]);
        return this.getDateAfterDays(x, 1);
      } else if (this.selectedType == "1") {
        return this.startDate;
      } else if (this.selectedType == "4") {
        return this.startDate;
      } else if (this.selectedType == "3") {
        return this.startDate;
      } else {
        if (this.weekRange == "") return null;
        let week1 = this.weekRange;
        let week2 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 7)
          .join(",");
        let week3 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 14)
          .join(",");
        let week4 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 21)
          .join(",");
        let week5 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 28)
          .join(",");
        let wr = week1 + "," + week2 + "," + week3 + "," + week4 + "," + week5;
        let diffW = Number(new Date(this.startDate).getDay());
        let wrN = wr
          .split(",")
          .map((number) => number * 1 - diffW)
          .filter((item) => item >= 0);
        let x = Number(diffDate) + Number(wrN[0]);
        let y = this.getDateAfterDays(x);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      }
    },

    day2() {
      var date1 = new Date(this.startDate);
      var date2 = new Date(this.today);
      const diff = date1.getTime() - date2.getTime();
      const diffDate = diff / (24 * 60 * 60 * 1000);
      var endTemp = Number(this.endDate.replaceAll("-", ""));
      if (this.isOnce) {
        return null;
      } else if (
        (this.isCurve && this.isType == "2") ||
        (this.isCustom && this.isType == "1")
      ) {
        if (!this.curveDays.split(" ")[1]) return null;
        let x = Number(diffDate) + Number(this.curveDays.split(" ")[1]);
        let y = this.getDateAfterDays(x, 1);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      } else if (this.selectedType == "1") {
        let x = Number(diffDate) + Number(this.numOf) * 1;
        let y = this.getDateAfterDays(x, 1);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      } else if (this.selectedType == "4") {
        let x =
          Number(this.startDate.split("-")[0]) +
          Number(this.numOf) * 1 +
          this.startDate.slice(4);
        if (this.hasEnd && Number(x.replaceAll("-", "")) > endTemp) return null;
        else return x;
      } else if (this.selectedType == "3") {
        var startTemp = new Date(this.startDate);
        startTemp.setMonth(startTemp.getMonth() + Number(this.numOf) * 1);
        var x = startTemp.toLocaleDateString("af").replaceAll("/", "-");
        if (this.hasEnd && Number(x.replaceAll("-", "")) > endTemp) return null;
        else return x;
      } else {
        if (this.weekRange == "") return null;
        let week1 = this.weekRange;
        let week2 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 7)
          .join(",");
        let week3 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 14)
          .join(",");
        let week4 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 21)
          .join(",");
        let week5 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 28)
          .join(",");
        let wr = week1 + "," + week2 + "," + week3 + "," + week4 + "," + week5;
        let diffW = Number(new Date(this.startDate).getDay());
        let wrN = wr
          .split(",")
          .map((number) => number * 1 - diffW)
          .filter((item) => item >= 0);
        let x = Number(diffDate) + Number(wrN[1]);
        let y = this.getDateAfterDays(x);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      }
    },

    day3() {
      var date1 = new Date(this.startDate);
      var date2 = new Date(this.today);
      const diff = date1.getTime() - date2.getTime();
      const diffDate = diff / (24 * 60 * 60 * 1000);
      var endTemp = Number(this.endDate.replaceAll("-", ""));
      if (this.isOnce) {
        return null;
      } else if (
        (this.isCurve && this.isType == "2") ||
        (this.isCustom && this.isType == "1")
      ) {
        if (!this.curveDays.split(" ")[2]) return null;
        let x = Number(diffDate) + Number(this.curveDays.split(" ")[2]);
        let y = this.getDateAfterDays(x, 1);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      } else if (this.selectedType == "1") {
        let x = Number(diffDate) + Number(this.numOf) * 2;
        let y = this.getDateAfterDays(x, 1);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      } else if (this.selectedType == "4") {
        let x =
          Number(this.startDate.split("-")[0]) +
          Number(this.numOf) * 2 +
          this.startDate.slice(4);
        if (this.hasEnd && Number(x.replaceAll("-", "")) > endTemp) return null;
        else return x;
      } else if (this.selectedType == "3") {
        var startTemp = new Date(this.startDate);
        startTemp.setMonth(startTemp.getMonth() + Number(this.numOf) * 2);
        var x = startTemp.toLocaleDateString("af").replaceAll("/", "-");
        if (this.hasEnd && Number(x.replaceAll("-", "")) > endTemp) return null;
        else return x;
      } else {
        if (this.weekRange == "") return null;
        let week1 = this.weekRange;
        let week2 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 7)
          .join(",");
        let week3 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 14)
          .join(",");
        let week4 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 21)
          .join(",");
        let week5 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 28)
          .join(",");
        let wr = week1 + "," + week2 + "," + week3 + "," + week4 + "," + week5;
        let diffW = Number(new Date(this.startDate).getDay());
        let wrN = wr
          .split(",")
          .map((number) => number * 1 - diffW)
          .filter((item) => item >= 0);
        let x = Number(diffDate) + Number(wrN[2]);
        let y = this.getDateAfterDays(x);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      }
    },

    day4() {
      var date1 = new Date(this.startDate);
      var date2 = new Date(this.today);
      const diff = date1.getTime() - date2.getTime();
      const diffDate = diff / (24 * 60 * 60 * 1000);
      var endTemp = Number(this.endDate.replaceAll("-", ""));
      if (this.isOnce) {
        return null;
      } else if (
        (this.isCurve && this.isType == "2") ||
        (this.isCustom && this.isType == "1")
      ) {
        if (!this.curveDays.split(" ")[3]) return null;
        let x = Number(diffDate) + Number(this.curveDays.split(" ")[3]);
        let y = this.getDateAfterDays(x, 1);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      } else if (this.selectedType == "1") {
        let x = Number(diffDate) + Number(this.numOf) * 3;
        let y = this.getDateAfterDays(x, 1);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      } else if (this.selectedType == "4") {
        let x =
          Number(this.startDate.split("-")[0]) +
          Number(this.numOf) * 3 +
          this.startDate.slice(4);
        if (this.hasEnd && Number(x.replaceAll("-", "")) > endTemp) return null;
        else return x;
      } else if (this.selectedType == "3") {
        var startTemp = new Date(this.startDate);
        startTemp.setMonth(startTemp.getMonth() + Number(this.numOf) * 3);
        var x = startTemp.toLocaleDateString("af").replaceAll("/", "-");
        if (this.hasEnd && Number(x.replaceAll("-", "")) > endTemp) return null;
        else return x;
      } else {
        if (this.weekRange == "") return null;
        let week1 = this.weekRange;
        let week2 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 7)
          .join(",");
        let week3 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 14)
          .join(",");
        let week4 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 21)
          .join(",");
        let week5 = this.weekRange
          .split(",")
          .map((number) => number * 1 + this.numOf * 28)
          .join(",");
        let wr = week1 + "," + week2 + "," + week3 + "," + week4 + "," + week5;
        let diffW = Number(new Date(this.startDate).getDay());
        let wrN = wr
          .split(",")
          .map((number) => number * 1 - diffW)
          .filter((item) => item >= 0);
        let x = Number(diffDate) + Number(wrN[3]);
        let y = this.getDateAfterDays(x);
        if (this.hasEnd && Number(y.replaceAll("-", "")) > endTemp) return null;
        else return y;
      }
    },

    frontAndBack() {
      if (this.contentIndex == 1) return this.$t("reminder.frontSide");
      else return this.$t("reminder.backSide");
    },

    isEnglishLine1() {
      if (
        !this.itemContent[this.sentenceIndex - 1] ||
        !this.itemContent[this.sentenceIndex - 1].split("\n\t")[1]
      )
        return false;
      let str = this.itemContent[this.sentenceIndex - 1]
        .split("\n\t")[1]
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "");
      return /^[a-zA-Z]/.test(str);
    },

    isEnglishLine2() {
      if (
        !this.itemContent[this.sentenceIndex - 1] ||
        !this.itemContent[this.sentenceIndex - 1].split("\n\t")[2] ||
        this.itemContent[this.sentenceIndex - 1].split("\n\t")[2] == " "
      )
        return false;
      else {
        let str = this.itemContent[this.sentenceIndex - 1]
          .split("\n\t")[2]
          .replace(/^\s\s*/, "")
          .replace(/\s\s*$/, "");
        return /^[a-zA-Z]/.test(str);
      }
    },

    isTodayEarly() {
      const d1 = Date.parse(this.today);
      const d2 = Date.parse(this.selectedDate);
      if (d1 < d2) return false;
      else return true;
    },

    arrIsDue() {
      var tempDue = [];
      for (let i = 0; i < this.itemContent.length; i++) {
        let reviewDate = this.itemContent[i]
          .split("\n\t")[4]
          .split("latestReviewed:")[1];
        const d1 = Date.parse(reviewDate);
        const d2 = Date.parse(this.selectedDate);
        if (d1 < d2) tempDue[i] = true;
        else tempDue[i] = false;
      }
      return tempDue;
    },
    arrIsImpt() {
      var tempImpt = [];
      for (let i = 0; i < this.itemContent.length; i++) {
        if (this.itemContent[i].split("\n\t")[4].includes("::impt:true"))
          tempImpt[i] = true;
        else tempImpt[i] = false;
      }
      return tempImpt;
    },
  },

  watch: {
    isShowAllList() {
      this.getItemContent();
      this.calcList();
    },
    savedContent() {
      this.getItemContent();
      this.itemList = this.savedContent.split(";.\n\t\n\t")[1];
    },
    selectedDate() {
      this.getItemContent();
    },
    isOnce() {
      if (this.isOnce) {
        this.isEvery = false;
        this.isCustom = false;
      }
    },
    isEvery() {
      if (this.isEvery) {
        this.isOnce = false;
        this.isCustom = false;
      }
    },
    isCustom() {
      if (this.isCustom) {
        this.isEvery = false;
        this.isOnce = false;
      }
    },
    isNever() {
      if (this.isNever) {
        this.hasEnd = false;
      }
    },
    hasEnd() {
      if (this.hasEnd) {
        this.isNever = false;
      }
    },
    readerFront() {
      if (this.hasSpeechSynthesis) {
        if (this.readerFront < 1) this.readerFront = 1;
        this.readerFront = Math.floor(this.readerFront);
        window.localStorage.setItem("readerFront", this.readerFront);
      } else this.readerFront = 0;
    },

    readerBack() {
      if (this.hasSpeechSynthesis) {
        if (this.readerBack < 1) this.readerBack = 1;
        this.readerBack = Math.floor(this.readerBack);
        window.localStorage.setItem("readerBack", this.readerBack);
      } else this.readerBack = 0;
    },

    isSystemTTS: function () {
      this.save();
    },

    autoPlay: function () {
      this.save();
    },

    isAutoDetectLang: function () {
      if (this.isAutoDetectLang) {
        this.isUtterTransLine = true;
        this.autoDetectLangInTrans();
      }
      this.save();
    },

    isUtterTransLine: function () {
      this.save();
    },

    langInFrontSide: function () {
      this.save();
    },
    langInBackSide: function () {
      this.save();
    },
    speedOfUtterFront: function () {
      this.save();
    },
    speedOfUtterBack: function () {
      this.save();
    },

    itemContent: function () {
      this.getFrontAttach();
      this.getBackAttach();
    },
    sentenceIndex: function () {
      this.getFrontAttach();
      this.getBackAttach();
    },

    TTSurlFront: function () {
      this.save();
    },
    TTSurlBack: function () {
      this.save();
    },
    searchList: function () {
      this.searchList = this.searchList.replaceAll("；", ";");
      if (this.searchList == ";") this.searchList = "";
      var sList = this.searchList.split(";");
      sList = sList.map(function (item) {
        return item.trim();
      });
      this.selectedSpecials = sList
        .filter((item) => item.startsWith("@"))
        .join(";")
        .replace(";", "");
      this.selectedTags = sList.filter((item) => item.startsWith("*"));
      this.selectedTypes = sList
        .filter((item) => item.startsWith("#"))
        .join(";")
        .replace(";", "");
      this.selectedWords = sList
        .filter((item) => !item.startsWith("*"))
        .filter((item) => !item.startsWith("#"))
        .filter((item) => !item.startsWith("@"));
      this.calcList();
    },
  },

  async mounted() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.key);
    window.localStorage.setItem("cachedOther", 1);
    this.readToDoList();
    this.getItemContent();
    this.getReader();
    this.getCachedAttach();
    this.initUtter();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.key);
    this.cleanUp();
  },

  methods: {
    logout: auth.logout,
    async readToDoList() {
      var PDJcontent = "";
      var PDJserverContent = null;
      if (
        (this.allowOffline ||
          window.localStorage.getItem("PDJ-ToDoList.txtNotUpload")) &&
        this.user.id == window.localStorage.getItem("userID") &&
        window.localStorage.getItem("PDJ-ToDoList.txt")
      ) {
        PDJcontent = window.localStorage.getItem("PDJ-ToDoList.txt");
      } else {
        try {
          PDJserverContent = await api.fetch(
            "/files/!PDJ/" + "PDJ-ToDoList.txt"
          );
          PDJcontent = PDJserverContent.content;
          window.localStorage.setItem("userID", this.user.id);
          window.localStorage.setItem("PDJ-ToDoList.txt", PDJcontent);
        } catch (e) {
          this.showConfirm();
        }
      }

      if (PDJcontent !== "") {
        this.savedContent = PDJcontent;
        this.getItemContent();
        this.itemList = PDJcontent.split(";.\n\t\n\t")[1];
        this.tags = this.getTags();
        let config = PDJcontent.split("tags:")[0]
          .split("::\n\t\n\t")[0]
          .split("customConfig: ")[1]
          .split("::");
        this.isSystemTTS = JSON.parse(config[0]);
        this.autoPlay = JSON.parse(config[1]);
        this.isUtterTransLine = JSON.parse(config[2]);
        this.isAutoDetectLang = JSON.parse(config[3]);
        this.langInFrontSide = JSON.parse(config[4]);
        this.langInBackSide = JSON.parse(config[5]);
        this.speedOfUtterFront = JSON.parse(config[6]);
        this.TTSurlFront = JSON.parse(config[7]);
        this.TTSurlBack = JSON.parse(config[8]);
        this.speedOfUtterBack = JSON.parse(config[9]);
        if (!this.hasSpeechSynthesis) this.isSystemTTS = "No";
      }
      if (
        window.localStorage.getItem("PDJ-ToDoList.txtNotUpload") ||
        !window.localStorage.getItem("PDJ-ToDoList.txt")
      )
        this.save();
    },
    switchTab(x) {
      if (x == 1) this.isType = "1";
      else if (x == 2) this.isType = "2";
      else this.isType = "3";
    },

    getCachedAttach() {
      var vm = this;
      localforage
        .keys()
        .then(function (keys) {
          var arrNeedCache = vm.arrAllCachedAttach.filter(
            (item) => !keys.includes(item)
          );
          vm.initCacheAttach(arrNeedCache);
        })
        .catch(function () {
          return;
        });
    },

    async initCacheAttach(x) {
      for await (const keyName of x) {
        var tToken = window.localStorage.getItem("lastRawToken");
        var fullPath =
          "/api/raw/!PDJ/ToDoList-attachments/" +
          keyName +
          "?auth=" +
          tToken +
          "&inline=true";
        await fetch(fullPath)
          .then((response) => response.blob())
          .then((blob) => {
            localforage.setItem(keyName, blob, function () {});
            window.localStorage.setItem("hasCachedAttach", 1);
          })
          .catch((error) => {
            console.error("Error fetching or converting URL:", error);
          });
      }
    },

    getReader() {
      if (!this.hasSpeechSynthesis) {
        this.readerFront = 0;
        this.readerBack = 0;
      }
      if (window.localStorage.getItem("readerFront") == null)
        this.readerFront = 1;
      else
        this.readerFront = Number(window.localStorage.getItem("readerFront"));
      if (window.localStorage.getItem("readerBack") == null)
        this.readerBack = 1;
      else this.readerBack = Number(window.localStorage.getItem("readerBack"));
    },

    showDropDown() {
      this.isDropDown = !this.isDropDown;
    },

    switchDone(index) {
      var newItem;
      if (this.arrIsDue[index]) {
        newItem =
          this.itemContent[index].slice(0, -13) + this.selectedDate + "\n\t]";
        this.itemList = this.itemList.replace(this.itemContent[index], newItem);
        this.save();
      } else {
        newItem =
          this.itemContent[index].slice(0, -13) +
          this.yesterSelectedDate +
          "\n\t]";
        this.itemList = this.itemList.replace(this.itemContent[index], newItem);
        this.save();
      }
    },

    getItemContent() {
      if (this.isShowAllList) {
        var tempContent = this.savedContent;
        tempContent = tempContent.split(";.\n\t\n\t")[1];
        if (tempContent) {
          this.itemContent = tempContent.split("\n\t\n\t");
          this.itemContent.reverse();
        } else this.itemContent = [];
      } else {
        var tempContent1 = this.savedContent;
        tempContent1 = tempContent1.split(";.\n\t\n\t")[1];
        if (tempContent1) {
          var allList = tempContent1.split("\n\t\n\t");
          var list = [];
          var cDate = Number(this.selectedDate.replaceAll("-", ""));
          var date1 = new Date(this.selectedDate);
          for (let i = 0; i < allList.length; i++) {
            var rawLine4 = allList[i].split("\n\t")[4];
            var sDate = Number(
              rawLine4
                .split("startDate:")[1]
                .split("::endDate:")[0]
                .replaceAll("-", "")
            );
            var eDate = Number(
              rawLine4
                .split("::endDate:")[1]
                .split("::impt:")[0]
                .replaceAll("-", "")
            );
            var rType = rawLine4
              .split("::repeatType:")[1]
              .split("::startDate:")[0]
              .replaceAll("-", "");
            var hit = false;
            var date2 = new Date(
              rawLine4.split("startDate:")[1].split("::endDate:")[0]
            );
            const diff = date1.getTime() - date2.getTime();
            const diffDate = diff / (24 * 60 * 60 * 1000);
            if (cDate >= sDate && cDate <= eDate) {
              if (rType == "once" && cDate == sDate) {
                hit = true;
              } else if (rType.startsWith("Ebbinghaus:")) {
                var range =
                  ":" + rType.split(":")[1].replaceAll(" ", ":") + ":";
                if (range.includes(":" + diffDate + ":")) hit = true;
              } else if (rType.startsWith("everyOfDays:")) {
                let num = Number(rType.split(":")[1]);
                if (diffDate % num == 0) hit = true;
              } else if (rType.startsWith("everyOfYears:")) {
                let num = Number(rType.split(":")[1]);
                if (
                  rawLine4
                    .split("startDate:")[1]
                    .split("::endDate:")[0]
                    .slice(4) == this.selectedDate.slice(4) &&
                  (Number(this.selectedDate.slice(0, 4)) -
                    Number(
                      rawLine4
                        .split("startDate:")[1]
                        .split("::endDate:")[0]
                        .slice(0, 4)
                    )) %
                    num ==
                    0
                )
                  hit = true;
              } else if (rType.startsWith("everyOfMonths:")) {
                let num = Number(rType.split(":")[1]);
                if (
                  rawLine4
                    .split("startDate:")[1]
                    .split("::endDate:")[0]
                    .slice(7) == this.selectedDate.slice(7) &&
                  ((Number(this.selectedDate.slice(0, 4)) -
                    Number(
                      rawLine4
                        .split("startDate:")[1]
                        .split("::endDate:")[0]
                        .slice(0, 4)
                    )) *
                    12 +
                    Number(this.selectedDate.split("-")[1]) -
                    Number(
                      rawLine4
                        .split("startDate:")[1]
                        .split("::endDate:")[0]
                        .split("-")[1]
                    )) %
                    num ==
                    0
                )
                  hit = true;
              } else if (rType.startsWith("everyOfWeeks:")) {
                let num = Number(rType.split(":")[1]);
                let diffW = Number(
                  new Date(
                    rawLine4.split("startDate:")[1].split("::endDate:")[0]
                  ).getDay()
                );
                let wrange = "," + rType.split(":")[2] + ",";

                let target = (diffDate + diffW) % (num * 7);
                if (wrange.includes("," + target + ",")) hit = true;
              }

              if (hit) list.push(allList[i]);
            }
          }
          list.reverse();
          list.sort(function (a, b) {
            let timeA = Number(
              a.split("\n\t")[4].split("::repeatType:")[0].replace(":", "")
            );
            let timeB = Number(
              b.split("\n\t")[4].split("::repeatType:")[0].replace(":", "")
            );
            return timeA - timeB;
          });

          this.itemContent = list;
        } else {
          this.itemContent = [];
        }
      }
      if (this.sentenceIndex > this.itemContent.length)
        this.sentenceIndex = this.sentenceIndex - 1;
    },

    getTags() {
      var tempContent = this.savedContent;
      tempContent = tempContent.split(";.\n\t\n\t")[0];
      tempContent = tempContent.split("tags: ")[1];
      if (tempContent) return tempContent;
      else return "";
    },

    testTTSurl() {
      let transLineContent =
        this.itemContent[this.sentenceIndex - 1].split("\n\t")[1];
      let text =
        transLineContent !== undefined && transLineContent !== " "
          ? transLineContent
          : this.$t("reminder.noContent");
      let ttsFullUrl = this.TTSurlFront + text;

      fetch(ttsFullUrl)
        .then(() => {
          this.audio.src = ttsFullUrl;
          this.audio.play();
        })
        .catch((error) => console.error("Error Uttering Trans Line:", error));
    },
    resetTTSurl() {
      this.TTSurlFront =
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=";
      this.TTSurlBack =
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=";
    },
    testTTSVoiceFront() {
      if (this.isUtterTransLine && this.isSystemTTS == "Yes") {
        this.cleanUp();
        let transLineContent =
          this.itemContent[this.sentenceIndex - 1].split("\n\t")[1];
        this.utterThis.text =
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : this.$t("reminder.noContent");
        this.utterThis.lang = this.langInFrontSide;
        this.speedOfUtter = this.speedOfUtterFront;
        this.utterThis.rate = this.speedOfUtter;
        let voices = window.speechSynthesis.getVoices();

        let langInTransLine = this.langInFrontSide;
        let formattedLang =
          langInTransLine.substring(0, 3) +
          langInTransLine.substring(3).toUpperCase();
        this.reader = this.readerFront;
        this.utterThis.voice = voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        })[this.reader - 1];
        window.speechSynthesis.speak(this.utterThis);
        this.utterThis.onend = () => {
          this.cleanUp();
        };
      }
    },

    testTTSVoiceBack() {
      if (this.isUtterTransLine && this.isSystemTTS == "Yes") {
        this.cleanUp();
        let transLineContent =
          this.itemContent[this.sentenceIndex - 1].split("\n\t")[2];
        this.utterThis.text =
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : this.$t("reminder.noContent");
        this.utterThis.lang = this.langInBackSide;
        this.speedOfUtter = this.speedOfUtterBack;
        this.utterThis.rate = this.speedOfUtter;
        let voices = window.speechSynthesis.getVoices();

        let langInTransLine = this.langInBackSide;
        let formattedLang =
          langInTransLine.substring(0, 3) +
          langInTransLine.substring(3).toUpperCase();
        this.reader = this.readerBack;
        this.utterThis.voice = voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        })[this.reader - 1];
        window.speechSynthesis.speak(this.utterThis);
        this.utterThis.onend = () => {
          this.cleanUp();
        };
      }
    },

    autoDetectLangInTrans() {
      if (!this.isEnglishLine1) {
        this.langInFrontSide = navigator.language || navigator.userLanguage;
      } else {
        this.langInFrontSide = "en-US";
      }
      if (!this.isEnglishLine2) {
        this.langInBackSide = navigator.language || navigator.userLanguage;
      } else {
        this.langInBackSide = "en-US";
      }
    },

    deleteItem() {
      this.delItemAttach();
      let id = this.itemContent[this.sentenceIndex - 1]
        .split("[ ID=")[1]
        .split(":AttachFront")[0];
      var tList = this.itemList.split("\n\t\n\t");
      var ttList = tList.filter((item) => !item.includes(id));
      this.itemList = ttList.join("\n\t\n\t");
      this.save();
      if (!this.itemContent || this.itemContent == []) {
        this.itemContent = [];
        this.isItemReview = false;
      }
    },

    delItemAttach() {
      for (let i = 0; i < this.frontAttach.split(":::").length - 1; i++) {
        this.deleteAttach(i, 1);
      }
      for (let i = 0; i < this.backAttach.split(":::").length - 1; i++) {
        this.deleteAttach(i, 2);
      }
    },

    calcHref(keyName) {
      if (this.isInFetch) return;
      this.isInFetch = true;
      var tHref;
      var vm = this;
      localforage
        .getItem(keyName)
        .then(function (value) {
          tHref = URL.createObjectURL(value);
          if (vm.isMobile) window.open(tHref, "_self");
          else window.open(tHref, "_blank");
          vm.isInFetch = false;
        })
        .catch(function () {
          vm.fetchAttach(keyName);
        });
    },

    fetchAttach(keyName) {
      var vm = this;
      var tToken = window.localStorage.getItem("lastRawToken");
      var fullPath =
        "/api/raw/!PDJ/ToDoList-attachments/" +
        keyName +
        "?auth=" +
        tToken +
        "&inline=true";
      fetch(fullPath)
        .then((response) => response.blob())
        .then((blob) => {
          localforage.setItem(keyName, blob, function () {
            window.localStorage.setItem("hasCachedAttach", 1);
            setTimeout(() => {
              localforage
                .getItem(keyName)
                .then(function (value) {
                  var cachePath = URL.createObjectURL(value);
                  if (vm.isMobile) window.open(cachePath, "_self");
                  else window.open(cachePath, "_blank");
                  vm.isInFetch = false;
                })
                .catch(function () {
                  vm.isInFetch = false;
                });
            }, 200);
          });
        })
        .catch((error) => {
          console.error("Error fetching or converting URL:", error);
          vm.isInFetch = false;
        });
    },

    checkLandscape() {
      return window.matchMedia("(orientation: landscape)").matches;
    },

    showItemReview(x) {
      this.contentIndex = 1;
      this.isItemReview = !this.isItemReview;
      this.isEditItem = false;
      this.addNew = false;
      this.sentenceIndex = x + 1;
    },

    showConfirm() {
      var userConfirmation = window.confirm(
        this.$t("reminder.noTodoListFile", {
          favFileName: this.toDoListName,
        })
      );
      if (userConfirmation) {
        if (this.isAutoDetectLang) this.autoDetectLangInTrans();
        if (!this.hasSpeechSynthesis) {
          this.isSystemTTS = "No";
        }
        this.save();
      }
    },

    showConfirmUpload() {
      var userConfirmation = window.confirm(this.$t("reminder.uploadUnsaved"));
      if (userConfirmation) {
        this.uploadUnsaved();
      }
    },

    showConfirmDelete() {
      var userConfirmation = window.confirm(this.$t("reminder.deleteConfirm"));
      if (userConfirmation) {
        this.deleteItem();
      }
    },

    handleResize() {
      this.isLandscape = this.checkLandscape();
      this.resized = true;
    },

    addNewItem() {
      if (this.addNew) {
        this.delItemAttach();
      }
      this.addNew = !this.addNew;
      this.getFrontAttach();
      this.getBackAttach();
      if (this.addNew) {
        this.cleanUp();
        this.isEditItem = false;
        this.newItemLine1 = "";
        this.newItemLine2 = "";
        this.newItemLine3 = "";
      }
    },
    showAllList() {
      this.addNew = false;
      this.newItemLine1 = "";
      this.newItemLine2 = "";
      this.newItemLine3 = "";
      this.isShowAllList = !this.isShowAllList;
    },

    getDateAfterDays(n, m) {
      const date = new Date();
      const daysInMilliseconds = 1000 * 60 * 60 * 24; // 一天的毫秒数
      const nDaysAfter = new Date(date.getTime() + n * daysInMilliseconds); // n天后的日期
      if (m == 1) return nDaysAfter.toLocaleDateString().replaceAll("/", "-");
      if (this.user.locale == "zh-cn") {
        const dayOfWeekNumber = (date.getDay() + n) % 7;
        const daysOfWeek = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ];
        const dayOfWeekName = daysOfWeek[dayOfWeekNumber];
        return (
          nDaysAfter.toLocaleDateString().replaceAll("/", "-") +
          "  " +
          dayOfWeekName
        );
      } else
        return (
          nDaysAfter.toLocaleDateString().replaceAll("/", "-") +
          "  " +
          nDaysAfter.toString().slice(0, 3)
        );
    },

    uploadFile(x) {
      if (x == 1) {
        document.getElementById("upload-input1").value = "";
        document.getElementById("upload-input1").click();
      } else {
        document.getElementById("upload-input2").value = "";
        document.getElementById("upload-input2").click();
      }
    },

    markAllAsDone() {
      if (this.itemList && this.isTodayEarly) {
        var allList = this.itemList.split("\n\t\n\t");
        for (let i = 0; i < allList.length; i++) {
          let newItem = allList[i].slice(0, -12) + this.selectedDate + "\n\t]";
          this.itemList = this.itemList.replace(allList[i], newItem);
          this.save();
        }
      }
    },

    cleanUp() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.audio) this.audio.pause();
    },

    exitToList() {
      if (this.addNew) {
        this.showConfirmAdd();
        return;
      } else if (this.isEditItem) {
        if (this.attachChanged) alert(this.$t("reminder.attachChanged"));
        else this.showConfirmEdit();
        return;
      } else if (this.isSetting) {
        this.isSetting = false;
        return;
      } else {
        this.cleanUp();
        this.isItemReview = false;
        return;
      }
    },

    showConfirmAdd() {
      var userConfirmation = window.confirm(
        this.$t("reminder.leaveWithoutSave")
      );
      if (userConfirmation) {
        this.delItemAttach();
        this.addNew = !this.addNew;
        this.getFrontAttach();
        this.getBackAttach();
        this.isEditItem = false;
      }
    },

    showConfirmEdit() {
      var userConfirmation = window.confirm(
        this.$t("reminder.leaveWithoutSave")
      );
      if (userConfirmation) {
        this.isEditItem = false;
      }
    },

    calcItem(index) {
      var tempList = this.searchList + ";";
      if (this.selectedTags.includes("*" + this.arrTags[index])) {
        tempList = tempList.replace("*" + this.arrTags[index], "");
      } else {
        tempList = tempList + "*" + this.arrTags[index];
      }
      tempList = tempList.replace(/^;|;$/g, "");
      this.searchList = tempList;
    },

    calcType(index) {
      var tempList = this.searchList + ";";
      var tempArrList = this.searchList.split(";");
      if (this.selectedTypes == "#" + this.arrTypes[index]) {
        tempList = tempList.replace("#" + this.arrTypes[index], "");
      } else {
        tempArrList = tempArrList.filter((item) => !item.startsWith("#"));
        tempList = tempArrList.join(";") + ";#" + this.arrTypes[index];
      }
      tempList = tempList.replace(/^;|;$/g, "");
      this.searchList = tempList;
    },

    calcSpecials(index) {
      var tempList = this.searchList + ";";
      if (this.selectedSpecials.includes("@" + this.arrSpecials[index])) {
        tempList = tempList.replace("@" + this.arrSpecials[index], "");
      } else {
        tempList = tempList + "@" + this.arrSpecials[index];
      }
      tempList = tempList.replace(/^;|;$/g, "");
      this.searchList = tempList;
    },

    calcList() {
      this.getItemContent();
      var target = this.selectedTags.map((item) => item.replace(/^\*/, ""));
      var list = this.itemContent;
      var sublist = [];
      for (var i = 0; i < list.length; ++i) {
        let tTags = list[i].split("\n\t")[3].split(";");
        let tType = list[i].split("\n\t")[4];
        let tSpecials = list[i].split("\n\t")[0];
        let hasTags = this.isSubArr(target, tTags);
        let hasType = false;
        let hasWord = false;
        let hasSpecial = false;
        if (this.selectedTypes.includes("Recitation")) {
          if (tType.includes("::repeatType:Ebbinghaus:")) hasType = true;
        } else if (this.selectedTypes.includes("Memo")) {
          if (tType.includes("::repeatType:none:")) hasType = true;
        } else if (this.selectedTypes.includes("Regular")) {
          if (
            !tType.includes("::repeatType:none:") &&
            !tType.includes("::repeatType:Ebbinghaus:")
          )
            hasType = true;
        } else hasType = true;

        if (
          this.selectedSpecials.includes("With Attachments") &&
          this.selectedSpecials.includes("important")
        ) {
          if (tSpecials.includes("-") && tType.includes("::impt:true"))
            hasSpecial = true;
        } else if (this.selectedSpecials.includes("With Attachments")) {
          if (tSpecials.includes("-")) hasSpecial = true;
        } else if (this.selectedSpecials.includes("important")) {
          if (tType.includes("::impt:true")) hasSpecial = true;
        } else hasSpecial = true;

        let wholeSub = list[i].split("\n\t")[1] + list[i].split("\n\t")[2];
        hasWord = this.containsAll(wholeSub, this.selectedWords);
        if (hasTags && hasType && hasWord && hasSpecial) sublist.push(list[i]);
      }

      this.itemContent = sublist;
    },

    isSubArr(arr1, arr2) {
      return arr1.every((item) => {
        return arr2.includes(item);
      });
    },

    containsAll(str, arr) {
      return arr.every(function (item) {
        return str.includes(item);
      });
    },

    switchImportant() {
      console.log("not yet");
    },

    submitItem() {
      this.attachChanged = false;
      this.newItemLine1 = this.newItemLine1.replace(/^\s+|\s+$/g, "");
      if (this.newItemLine1 == "") {
        alert(this.$t("reminder.alert1"));
        return;
      }
      if (this.weekRange == "" && this.isEvery && this.selectedType == "2") {
        alert(this.$t("reminder.alert2"));
        return;
      }
      this.curveDays = this.curveDays.trim();
      if (this.isCurve && this.isType == "2" && this.curveDays == "") {
        alert(this.$t("reminder.alert3"));
        return;
      }
      if (this.isCustom && this.isType == "1" && this.curveDays == "") {
        alert(this.$t("reminder.alert4"));
        return;
      }

      if (
        this.hasEnd &&
        Number(this.endDate.replaceAll("-", "")) <
          Number(this.startDate.replaceAll("-", ""))
      ) {
        alert(this.$t("reminder.alert5"));
        return;
      }
      this.newItemLine3 = this.newItemLine3.replaceAll("；", ";"); //replace chinese code ；
      this.newItemLine3 = this.newItemLine3.trim();
      this.newItemLine3 = this.newItemLine3.replace(/;$/, ""); //delete the last ;
      this.newItemLine3 = this.newItemLine3.trim();
      if (this.tags == " ") this.tags = " ;" + this.newItemLine3; //merge
      else this.tags = this.tags + ";" + this.newItemLine3; //merge
      let arr = this.tags.split(";");
      arr = this.trimArrayElements(arr); //trim space before and after each tag.
      arr = this.unique(arr); // remove duplicate tags
      this.tags = arr.join(";").replaceAll('""', "");
      this.tags = this.tags.replace(/^;|;$/g, "");
      this.itemList = this.itemList.replace(/^\s+|\s+$/g, "");
      if (this.newItemLine2 == "") this.newItemLine2 = " ";
      if (this.newItemLine3 == "") this.newItemLine3 = " ";
      var rType = "";
      if (this.isType == "3") {
        rType = "none::";
      } else {
        if (this.isType == "1" && this.isOnce) rType = "once::";
        else if (this.isType == "2" && this.isCurve)
          rType = "Ebbinghaus:" + this.curveDays + "::";
        else if (this.isType == "1" && this.isCustom)
          rType = "custom:" + this.curveDays + "::";
        else if (this.isType == "1" && this.isEvery && this.selectedType == "1")
          rType = "everyOfDays:" + this.numOf + "::";
        else if (this.isType == "1" && this.isEvery && this.selectedType == "3")
          rType = "everyOfMonths:" + this.numOf + "::";
        else if (this.isType == "1" && this.isEvery && this.selectedType == "4")
          rType = "everyOfYears:" + this.numOf + "::";
        else if (this.isType == "1" && this.isEvery && this.selectedType == "2")
          rType = "everyOfWeeks:" + this.numOf + ":" + this.weekRange + "::";
        var eDate = "";
        if (this.isNever) eDate = "2999-12-31";
        else eDate = this.endDate;
      }
      if (this.addNew) {
        let newItemLine4 =
          this.reviewTime +
          "::repeatType:" +
          rType +
          "startDate:" +
          this.startDate +
          "::endDate:" +
          eDate +
          "::impt:" +
          "false" +
          "::disable:" +
          "false" +
          "::latestReviewed:" +
          "0001-01-01";
        let id = Math.random();
        this.itemList =
          this.itemList +
          "\n\t\n\t" +
          "[ ID=" +
          id +
          ":AttachFront" +
          this.frontAttach +
          ":AttachBack" +
          this.backAttach +
          "\n\t" +
          this.newItemLine1 +
          "\n\t" +
          this.newItemLine2 +
          "\n\t" +
          this.newItemLine3 +
          "\n\t" +
          newItemLine4 +
          "\n\t]\n\t";
      } else {
        let newItemLine4 =
          this.reviewTime +
          "::repeatType:" +
          rType +
          "startDate:" +
          this.startDate +
          "::endDate:" +
          eDate +
          "::impt:" +
          this.importantDaily +
          "::disable:" +
          this.disabledDaily +
          "::latestReviewed:" +
          this.latestReviewDate;
        let id = this.itemId;
        var editedItem =
          "[ ID=" +
          id +
          ":AttachFront" +
          this.frontAttach +
          ":AttachBack" +
          this.backAttach +
          "\n\t" +
          this.newItemLine1 +
          "\n\t" +
          this.newItemLine2 +
          "\n\t" +
          this.newItemLine3 +
          "\n\t" +
          newItemLine4 +
          "\n\t]";
        this.itemList = this.itemList.replace(/^\s+|\s+$/g, "");
        var tList = this.itemList.split("\n\t\n\t");
        var ttList = tList.map((element) =>
          element.includes(id) ? editedItem : element
        );
        this.itemList = ttList.join("\n\t\n\t");
        this.savedContent = "tags: " + this.tags + ";.\n\t\n\t" + this.itemList;
      }
      this.save();
      this.newItemLine1 = "";
      this.newItemLine2 = "";
      this.newItemLine3 = "";
      this.isMon = true;
      this.isTue = true;
      this.isWed = true;
      this.isThu = true;
      this.isFri = true;
      this.isSat = false;
      this.isSun = false;
      this.selectedType = "1";
      this.numOf = 1;
      this.isEvery = true;
      this.reviewHour = 8;
      this.reviewMinute = 0;
      this.importantDaily = false;
      this.disabledDaily = false;
      this.curveDays = "1 3 7 15 30 60 120";
      this.isNever = true;
      this.hasEnd = false;
      this.isOnce = false;
      this.isCustom = false;
      this.isCurve = true;
      this.startDate = new Date().toLocaleDateString("af").replaceAll("/", "-");
      this.endDate = this.getDateAfterDays(7, 1);
      this.isEditItem = false;
      if (this.addNew) {
        this.addNew = false;
        this.isItemReview = false;
      }
    },

    trimArrayElements(array) {
      return array.map(function (item) {
        return item.trim();
      });
    },

    unique(arr) {
      let res = [];
      for (let i = 0; i < arr.length; i++) {
        if (!res.includes(arr[i])) {
          res.push(arr[i]);
        }
      }
      return res;
    },

    addTags(index) {
      this.newItemLine3 = this.newItemLine3.replaceAll("；", ";");
      this.newItemLine3 = this.newItemLine3.trimEnd();
      this.newItemLine3 = this.newItemLine3.replace(/;$/, ""); //delete the last ;.
      this.newItemLine3 = this.newItemLine3.trimEnd();
      if (this.newItemLine3 == "") {
        this.newItemLine3 = this.arrTags[index];
        return;
      }
      var arrNewItenLine3 = this.newItemLine3.split(";");
      arrNewItenLine3 = arrNewItenLine3.map(function (item) {
        return item.trim();
      });
      if (arrNewItenLine3.includes(this.arrTags[index])) {
        arrNewItenLine3 = arrNewItenLine3.filter(
          (item) => item !== this.arrTags[index]
        );
      } else {
        arrNewItenLine3.push(this.arrTags[index]);
      }
      this.newItemLine3 = arrNewItenLine3.join(";");
    },

    click() {
      this.touches++;
      if (
        this.touches == 1 &&
        this.isItemReview &&
        !window.speechSynthesis.speaking &&
        this.audio.paused
      ) {
        this.utterTransLine();
      } else {
        this.cleanUp();
      }
      setTimeout(() => {
        if (this.touches == 2) {
          //double click
          this.showEditItem();
          this.touches = 0;
          return;
        }
        this.touches = 0;
      }, 300);
    },

    initUtter() {
      this.audio = new Audio();
      if (this.hasSpeechSynthesis) {
        this.utterThis = new SpeechSynthesisUtterance();
      }
    },

    utterTransLine() {
      if (this.isUtterTransLine && this.isSystemTTS == "Yes") {
        let langInTransLine = "";
        if (this.contentIndex == 1) {
          langInTransLine = this.langInFrontSide;
        } else langInTransLine = this.langInBackSide;

        let transLineContent =
          this.itemContent[this.sentenceIndex - 1].split("\n\t")[
            this.contentIndex
          ];
        this.utterThis.text =
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : this.$t("reminder.noContent");
        if (langInTransLine == "") {
          langInTransLine = navigator.language || navigator.userLanguage;
        }
        this.utterThis.lang = langInTransLine;
        if (this.contentIndex == 1) this.speedOfUtter = this.speedOfUtterFront;
        else this.speedOfUtter = this.speedOfUtterBack;
        this.utterThis.rate = this.speedOfUtter;
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          langInTransLine.substring(0, 3) +
          langInTransLine.substring(3).toUpperCase();
        if (this.contentIndex == 1) this.reader = this.readerFront;
        else this.reader = this.readerBack;
        this.utterThis.voice = voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        })[this.reader - 1];
        window.speechSynthesis.speak(this.utterThis);
      } else if (this.isUtterTransLine && this.isSystemTTS == "No") {
        let transLineContent =
          this.itemContent[this.sentenceIndex - 1].split("\n\t")[
            this.contentIndex
          ];
        let text =
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : this.$t("reminder.noContent");
        let ttsFullUrl = "";
        if (this.contentIndex == 1) ttsFullUrl = this.TTSurlFront + text;
        else ttsFullUrl = this.TTSurlBack + text;
        fetch(ttsFullUrl)
          .then(() => {
            this.audio.src = ttsFullUrl;
            this.audio.play();
          })
          .catch((error) => console.error("Error Uttering Trans Line:", error));
      }
    },

    uploadInput(event, x) {
      if (this.isEditItem) this.attachChanged = true;
      this.$store.commit("closeHovers");
      let files = event.currentTarget.files;
      let folder_upload =
        files[0].webkitRelativePath !== undefined &&
        files[0].webkitRelativePath !== "";

      if (folder_upload) {
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          files[i].fullPath = file.webkitRelativePath;
        }
      }
      var currentTime = new Date();
      let id = Math.floor(currentTime.getTime() / 1000);
      var keyName = id + "-" + files[0].name;
      let vmm = this;
      let path = this.$route.path.endsWith("/")
        ? this.$route.path + "!PDJ/ToDoList-attachments/"
        : this.$route.path + "/!PDJ/ToDoList-attachments/";

      var keyValue;
      localforage.setItem(keyName, files[0], function () {
        window.localStorage.setItem("hasCachedAttach", 1);
        setTimeout(() => {
          localforage
            .getItem(keyName)
            .then(function (value) {
              if (x == 1) {
                vmm.frontAttach = vmm.frontAttach + ":::" + keyName;
              } else {
                vmm.backAttach = vmm.backAttach + ":::" + keyName;
              }
              keyValue = value;
              vmm.uploadNow(path + keyName, keyValue, keyName);
            })
            .catch(function () {});
        }, 200);
      });
    },

    async uploadNow(x, y, keyName) {
      this.unSavedAttach = this.unSavedAttach + ":::" + keyName;
      window.localStorage.setItem("unSavedAttach", this.unSavedAttach);
      try {
        await api.post(x, y, true);
        this.unSavedAttach = this.unSavedAttach.replace(":::" + keyName, "");
        window.localStorage.setItem("unSavedAttach", this.unSavedAttach);
      } catch (error) {
        console.log(error);
      }
    },

    async uploadUnsaved() {
      if (window.localStorage.getItem("PDJ-ToDoList.txtNotUpload")) {
        await this.saveNow();
      }
      if (this.unSavedAttach !== "") {
        var arrUnsaved = this.unSavedAttach
          .replace(/^:::|:::$/g, "")
          .split(":::");
        var keyValue;
        let path = this.$route.path.endsWith("/")
          ? this.$route.path + "!PDJ/ToDoList-attachments/"
          : this.$route.path + "/!PDJ/ToDoList-attachments/";
        for await (const keyName of arrUnsaved) {
          keyValue = await localforage.getItem(keyName);
          try {
            await api.post(path + keyName, keyValue, true);
            this.unSavedAttach = this.unSavedAttach.replace(
              ":::" + keyName,
              ""
            );
            window.localStorage.setItem("unSavedAttach", this.unSavedAttach);
          } catch (error) {
            console.log(error);
          }
        }
      }
      if (this.unDeleted !== "") {
        var arrUndeleted = this.unDeleted
          .replace(/^:::|:::$/g, "")
          .split(":::");
        for await (const keyName of arrUndeleted) {
          this.unDeleted = this.unDeleted.replace(":::" + keyName, "");
          window.localStorage.setItem("unDeleted", this.unDeleted);
          await this.deleteFile(keyName);
        }
      }
    },

    deleteAttach(index, x) {
      if (this.isEditItem) this.attachChanged = true;
      var keyName;
      if (x == 1) {
        let vm = this;
        keyName = this.frontAttach.split(":::")[index + 1];
        localforage.removeItem(keyName, function () {
          vm.frontAttach = vm.frontAttach.replace(":::" + keyName, "");
          vm.deleteFile(keyName);
        });
      } else {
        let vm = this;
        keyName = this.backAttach.split(":::")[index + 1];
        localforage.removeItem(keyName, function () {
          vm.backAttach = vm.backAttach.replace(":::" + keyName, "");
          vm.deleteFile(keyName);
        });
      }
    },

    async deleteFile(x) {
      let path = this.$route.path.endsWith("/")
        ? this.$route.path + "!PDJ/ToDoList-attachments/"
        : this.$route.path + "/!PDJ/ToDoList-attachments/";
      var fullPath = path + x;
      try {
        this.unDeleted = this.unDeleted + ":::" + x;
        window.localStorage.setItem("unDeleted", this.unDeleted);
        await api.remove(fullPath);
        this.unDeleted = this.unDeleted.replace(":::" + x, "");
        window.localStorage.setItem("unDeleted", this.unDeleted);
      } catch (e) {
        this.$showError(e);
      }
    },

    getFrontAttach() {
      if (this.addNew) {
        this.frontAttach = "";
        return;
      }
      if (
        !this.itemContent[this.sentenceIndex - 1] ||
        !this.itemContent[this.sentenceIndex - 1]
          .split("\n\t")[0]
          .split(":AttachFront")[1]
      ) {
        this.frontAttach = "";
        return;
      }
      this.frontAttach = this.itemContent[this.sentenceIndex - 1]
        .split("\n\t")[0]
        .split(":AttachFront")[1]
        .split(":AttachBack")[0];
    },

    getBackAttach() {
      if (this.addNew) {
        this.backAttach = "";
        return;
      }
      if (
        !this.itemContent[this.sentenceIndex - 1] ||
        !this.itemContent[this.sentenceIndex - 1]
          .split("\n\t")[0]
          .split(":AttachBack")[1]
      ) {
        this.backAttach = "";
        return;
      }
      this.backAttach = this.itemContent[this.sentenceIndex - 1]
        .split("\n\t")[0]
        .split(":AttachBack")[1];
    },

    showEditItem() {
      this.cleanUp();
      var item = this.itemContent[this.sentenceIndex - 1].split("\n\t");
      this.newItemLine1 = item[1];
      this.newItemLine2 = item[2];
      if (item[3] == " ") this.newItemLine3 = "";
      else this.newItemLine3 = item[3] + ";";
      this.reviewHour = Number(item[4].split(":")[0]);
      this.reviewMinute = Number(item[4].split(":")[1]);
      var rT = item[4].split(":repeatType:")[1].split("::startDate:")[0];
      if (rT == "none") {
        this.isType = "3";
      } else if (rT == "once") {
        this.isType = "1";
        this.isOnce = true;
      } else if (rT.includes("everyOfDays")) {
        this.isType = "1";
        this.isEvery = true;
        this.selectedType = "1";
        this.numOf = Number(rT.split(":")[1]);
      } else if (rT.includes("everyOfWeeks")) {
        this.isType = "1";
        this.isEvery = true;
        this.selectedType = "2";
        this.numOf = Number(rT.split(":")[1]);
        if (rT.split(":")[2].includes("0")) {
          this.isSun = true;
        } else this.isSun = false;
        if (rT.split(":")[2].includes("1")) {
          this.isMon = true;
        } else this.isMon = false;
        if (rT.split(":")[2].includes("2")) {
          this.isTue = true;
        } else this.isTue = false;
        if (rT.split(":")[2].includes("3")) {
          this.isWed = true;
        } else this.isWed = false;
        if (rT.split(":")[2].includes("4")) {
          this.isThu = true;
        } else this.isThu = false;
        if (rT.split(":")[2].includes("5")) {
          this.isFri = true;
        } else this.isFri = false;
        if (rT.split(":")[2].includes("6")) {
          this.isSat = true;
        } else this.isSat = false;
      } else if (rT.includes("everyOfMonths")) {
        this.isType = "1";
        this.isEvery = true;
        this.selectedType = "3";
        this.numOf = Number(rT.split(":")[1]);
      } else if (rT.includes("everyOfYears")) {
        this.isType = "1";
        this.isEvery = true;
        this.selectedType = "4";
        this.numOf = Number(rT.split(":")[1]);
      } else if (rT.includes("Ebbinghaus")) {
        this.isType = "2";
        this.isCurve = true;
        this.curveDays = rT.split(":")[1];
      } else if (rT.includes("custom")) {
        this.isType = "1";
        this.isCustom = true;
        this.curveDays = rT.split(":")[1];
      }
      if (this.isType !== "3") {
        this.startDate = item[4]
          .split("::startDate:")[1]
          .split("::endDate:")[0];
        if (item[4].split("::impt")[0].split("::endDate:")[1] == "2999-12-31") {
          this.isNever = true;
        } else {
          this.hasEnd = true;
          this.endDate = item[4].split("::impt")[0].split("::endDate:")[1];
        }
        this.latestReviewDate = item[4].split("::latestReviewed:")[1];
      }

      this.importantDaily = JSON.parse(
        item[4].split("::impt:")[1].split("::disable:")[0]
      );
      this.disabledDaily = JSON.parse(
        item[4].split("::latestReviewed:")[0].split("::disable:")[1]
      );
      this.itemId = item[0].split("[ ID=")[1].split(":AttachFront")[0];
      this.frontAttach = item[0]
        .split(":AttachFront")[1]
        .split(":AttachBack")[0];
      this.backAttach = item[0].split(":AttachBack")[1];
      this.isEditItem = !this.isEditItem;
    },

    startDrag(event) {
      event.preventDefault();
      this.startTime = new Date().getTime();
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    endDrag(event) {
      event.preventDefault();
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.clientX - this.startX;
      this.distanceY = event.clientY - this.startY;
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) > Math.abs(this.distanceY) &&
        Math.abs(this.distanceX) > 60
      ) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) < Math.abs(this.distanceY) &&
        Math.abs(this.distanceY) > 100
      ) {
        this.checkNav(this.distanceY, "VERTICAL");
        return;
      }
      this.click();
    },

    startTouch(event) {
      event.preventDefault();
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },

    endTouch(event) {
      event.preventDefault();
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.changedTouches[0].clientX - this.startX;
      this.distanceY = event.changedTouches[0].clientY - this.startY;
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) > Math.abs(this.distanceY) &&
        Math.abs(this.distanceX) > 30
      ) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) < Math.abs(this.distanceY) &&
        Math.abs(this.distanceY) > 70
      ) {
        this.checkNav(this.distanceY, "VERTICAL");
        return;
      }
      this.click();
    },

    checkNav(x, mode) {
      if (x > 0 && mode == "SWITCHIMG" && this.sentenceIndex >= 1) {
        if (this.sentenceIndex == 1) return;
        this.contentIndex = 1;
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isAutoDetectLang) {
          this.isUtterTransLine = true;
          this.autoDetectLangInTrans();
        }
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (
        x < 0 &&
        mode == "SWITCHIMG" &&
        this.sentenceIndex <= this.itemContent.length
      ) {
        if (this.sentenceIndex == this.itemContent.length) return;
        this.contentIndex = 1;
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isAutoDetectLang) {
          this.isUtterTransLine = true;
          this.autoDetectLangInTrans();
        }
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (x < 0 && mode == "VERTICAL") {
        this.contentIndex = 2;
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (x > 0 && mode == "VERTICAL") {
        if (this.contentIndex == 1) {
          this.isItemReview = false;
          this.cleanUp();
          return;
        }
        this.contentIndex = 1;
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      }
    },

    onSetting() {
      this.getReader();
      this.cleanUp();
      this.isSetting = !this.isSetting;
    },

    reCalcTags() {
      var allTags = "";
      var tempContent1 = this.itemList;
      if (tempContent1) {
        var allList = tempContent1.split("\n\t\n\t");
        for (let i = 0; i < allList.length; i++) {
          allTags = allTags + ";" + allList[i].split("\n\t")[3];
        }
      }
      var arrAllTags = allTags.replace(/^;+|;+$/g, "").split(";");
      var tempArrTags = this.tags.split(";");
      tempArrTags = tempArrTags.filter((item) => arrAllTags.includes(item));
      return tempArrTags.join(";");
    },

    save() {
      this.itemList = this.itemList.trim();
      this.tags = this.reCalcTags();
      let customConfig =
        "customConfig: " +
        JSON.stringify(this.isSystemTTS) +
        "::" +
        JSON.stringify(this.autoPlay) +
        "::" +
        JSON.stringify(this.isUtterTransLine) +
        "::" +
        JSON.stringify(this.isAutoDetectLang) +
        "::" +
        JSON.stringify(this.langInFrontSide) +
        "::" +
        JSON.stringify(this.langInBackSide) +
        "::" +
        JSON.stringify(this.speedOfUtterFront) +
        "::" +
        JSON.stringify(this.TTSurlFront) +
        "::" +
        JSON.stringify(this.TTSurlBack) +
        "::" +
        JSON.stringify(this.speedOfUtterBack) +
        "::";

      this.savedContent =
        customConfig +
        "\n\t\n\t" +
        "tags: " +
        this.tags +
        ";.\n\t\n\t" +
        this.itemList;
      this.saveNow();
    },

    async saveNow() {
      window.localStorage.setItem("PDJ-ToDoList.txt", this.savedContent);
      window.localStorage.setItem("PDJ-ToDoList.txtNotUpload", "1");
      this.unsavedTask = "1";
      try {
        await api.post(
          "/files/!PDJ/" + "PDJ-ToDoList.txt",
          this.savedContent,
          true
        );
        window.localStorage.removeItem("PDJ-ToDoList.txtNotUpload");
        this.unsavedTask = "";
      } catch (error) {
        console.log(error);
      }
    },

    key(event) {
      if (this.isEditItem || this.addNew || this.isSetting) return;
      if (
        event.which === 39 &&
        this.sentenceIndex <= this.itemContent.length &&
        !this.isSetting
      ) {
        // right arrow
        if (this.sentenceIndex == this.itemContent.length) return;
        this.contentIndex = 1;
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isAutoDetectLang) {
          this.isUtterTransLine = true;
          this.autoDetectLangInTrans();
        }
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (
        event.which === 37 &&
        this.sentenceIndex >= 1 &&
        !this.isSetting
      ) {
        // left arrow
        if (this.sentenceIndex == 1) return;
        this.contentIndex = 1;
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isAutoDetectLang) {
          this.isUtterTransLine = true;
          this.autoDetectLangInTrans();
        }
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (event.which === 38 && !this.isSetting) {
        // up arrow
        this.contentIndex = 1;
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (event.which === 40 && !this.isSetting) {
        // down arrow
        this.contentIndex = 2;
        if (this.autoPlay) {
          this.cleanUp();
          this.click();
        } else this.cleanUp();
        return;
      } else if (event.which === 27) {
        // esc
        this.exitToList();
      }
    },
  },
};
</script>

<style>
span.headSubject {
  display: inline;
  color: black;
}

header {
  background: transparent;
}

@media (max-width: 736px) {
  header {
    display: flex;
    justify-content: space-around !important;
  }
}
</style>
